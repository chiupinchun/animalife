import { Block } from "@game/board";
import { Unit } from "@game/unit/unit";
import { Reducer } from "react";
import { BOARD_Y_COUNT } from "../constants/board";

export interface ReducerState {
  selectedUnit: Unit | null
  standbyUnits: Unit[]
  summonedUnits: Unit[]
  enemies: Unit[]
  cost: number

  error: string | null
}

export type ReducerAction = {
  type: 'selectUnit',
  payload: {
    unit: Unit
  }
} | {
  type: 'clearSelection'
} | {
  type: 'summon',
  payload: {
    block: Block
  }
} | {
  type: 'action',
  payload: {
    unit: Unit
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
      const { unit } = action.payload
      return {
        ...state,
        selectedUnit: unit
      }
    case 'clearSelection':
      return {
        ...state,
        selectedUnit: null
      }
    case 'summon':
      const { block } = action.payload

      if (!selectedUnit) {
        return { ...state, error: '未選擇要部署的角色。' }
      }

      if (state.cost >= selectedUnit.cost) {
        const newCost = state.cost - selectedUnit.cost;
        const newSummonedUnits = [...state.summonedUnits, selectedUnit.summon(block.x, block.y)];
        const newStandbyUnits = state.standbyUnits.filter((unit) => unit !== selectedUnit);

        return {
          ...state,
          cost: newCost,
          summonedUnits: newSummonedUnits,
          standbyUnits: newStandbyUnits,
          selectedUnit: null
        }
      }

      return {
        ...state,
        selectedUnit: null,
        error: '資源不足。'
      }
    case 'action':
      const unitToAction = action.payload.unit
      const isEnemy = state.enemies.includes(unitToAction)

      const skillTargetGroup = unitToAction.searchTarget(
        isEnemy ? state.summonedUnits : state.enemies,
        isEnemy ? state.enemies : state.summonedUnits
      )
      if (skillTargetGroup.some(targets => targets.length)) {
        unitToAction.skill(...skillTargetGroup)

        return {
          ...state,
          enemies: state.enemies.filter(unit => unit.hp > 0),
          summonedUnits: state.summonedUnits.filter(unit => unit.hp > 0),
          selectedUnit: null,
          mode: null
        }
      }

      const directY = isEnemy ? -1 : 1
      const goalCoordinate = { x: unitToAction.x, y: unitToAction.y + directY * unitToAction.step }
      if (goalCoordinate.y < 0 || goalCoordinate.y > BOARD_Y_COUNT) { return state }

      const isBlocked = (unit: Unit) => unit.x === goalCoordinate.x
        && (unit.y - unitToAction.y) * directY > 0
        && Math.abs(unit.y - unitToAction.y) <= unitToAction.step
      const isGoalContainUnit = state.enemies.some(isBlocked) || state.summonedUnits.some(isBlocked)
      if (isGoalContainUnit) { return state }

      const newUnit = structuredClone(unitToAction)
      newUnit.y = goalCoordinate.y
      const newEnemies = state.enemies.map(unit =>
        unit === unitToAction ? newUnit : unit
      )
      const newSummonedUnits = state.summonedUnits.map(unit =>
        unit === unitToAction ? newUnit : unit
      )

      return {
        ...state,
        enemies: state.enemies.includes(unitToAction) ? newEnemies : state.enemies,
        summonedUnits: state.summonedUnits.includes(unitToAction) ? newSummonedUnits : state.summonedUnits,
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