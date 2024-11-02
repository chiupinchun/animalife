import { Block } from "@game/board";
import { Unit } from "@game/unit/unit";
import { Reducer } from "react";
import { BOARD_Y_COUNT } from "../constants/board";

export enum SelectMode {
  summon,
  skill
}

export interface ReducerState {
  selectedUnit: Unit | null
  mode: SelectMode | null
  standbyUnits: Unit[]
  summonedUnits: Unit[]
  enemies: Unit[]
  cost: number

  error: string | null
}

export type ReducerAction = {
  type: 'selectUnit',
  payload: {
    unit: Unit,
    mode: SelectMode
  }
} | {
  type: 'clearSelection'
} | {
  type: 'unitAction',
  payload: {
    block: Block
  }
} | {
  type: 'move',
  payload: {
    unit: Unit
  }
} | {
  type: 'skill',
  payload: {
    target: Unit
  }
} | {
  type: 'turnEnd'
} | {
  type: 'error',
  payload: string | null
}

export const reducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
  const { selectedUnit } = state
  switch (action.type) {
    case 'selectUnit':
      const { unit, mode } = action.payload
      return {
        ...state,
        mode,
        selectedUnit: unit
      }
    case 'clearSelection':
      return {
        ...state,
        mode: null,
        selectedUnit: null
      }
    case 'unitAction':
      const { block } = action.payload

      if (!selectedUnit) {
        return { ...state, error: '未選擇要部署的角色。' }
      }

      switch (state.mode) {
        case SelectMode.summon:
          if (state.cost >= selectedUnit.cost) {
            const newCost = state.cost - selectedUnit.cost;
            const newSummonedUnits = [...state.summonedUnits, selectedUnit.summon(block.x, block.y)];
            const newStandbyUnits = state.standbyUnits.filter((unit) => unit !== selectedUnit);

            return {
              ...state,
              cost: newCost,
              summonedUnits: newSummonedUnits,
              standbyUnits: newStandbyUnits,
              selectedUnit: null,
              mode: null
            };
          }

          return {
            ...state,
            selectedUnit: null,
            mode: null,
            error: '資源不足。'
          };
      }
      break
    case 'move':
      const unitToMove = action.payload.unit
      const directY = state.enemies.includes(unitToMove) ? -1 : 1
      const goalCoordinate = { x: unitToMove.x, y: unitToMove.y + directY * unitToMove.step }
      if (goalCoordinate.y < 0 || goalCoordinate.y > BOARD_Y_COUNT) { return state }

      const isBlocked = (unit: Unit) => unit.x === goalCoordinate.x
        && (unit.y - unitToMove.y) * directY > 0
        && Math.abs(unit.y - unitToMove.y) <= unitToMove.step
      const isGoalContainUnit = state.enemies.some(isBlocked) || state.summonedUnits.some(isBlocked)
      if (isGoalContainUnit) { return state }

      const newEnemies = state.enemies.map(unit =>
        unit === unitToMove ? { ...unit, y: goalCoordinate.y } : unit
      )
      const newSummonedUnits = state.summonedUnits.map(unit =>
        unit === unitToMove ? { ...unit, y: goalCoordinate.y } : unit
      )

      return {
        ...state,
        enemies: state.enemies.includes(unitToMove) ? newEnemies : state.enemies,
        summonedUnits: state.summonedUnits.includes(unitToMove) ? newSummonedUnits : state.summonedUnits,
      }
    case 'skill':
      const { target } = action.payload

      if (!selectedUnit) {
        return { ...state, error: '未選擇要部署的角色。' }
      }

      selectedUnit.skill(target)
      if (target.hp <= 0) {
        const index = state.enemies.indexOf(target)
        if (index > -1) {
          state.enemies.splice(index, 1)
        }
      }

      return {
        ...state,
        selectedUnit: null,
        mode: null
      }
    case 'turnEnd':
      return {
        ...state,
        cost: state.cost + 1
      }
    case 'error':
      return {
        ...state,
        error: action.payload
      }
  }
  return state
}