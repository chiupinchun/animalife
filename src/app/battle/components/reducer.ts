import { Block } from "@game/board";
import { Unit } from "@game/unit/unit";
import { Reducer } from "react";
import { BOARD_Y_COUNT, COST_LIMIT } from "../constants/game";

export interface ReducerState {
  selectedUnit: Unit | null
  standbyAllies: Unit[]
  summonedAllies: Unit[]
  standbyEnemies: Unit[]
  summonedEnemies: Unit[]
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
        const newSummonedUnits = [...state.summonedAllies, selectedUnit.summon(block.x, block.y)];
        const newStandbyUnits = state.standbyAllies.filter((unit) => unit !== selectedUnit);

        return {
          ...state,
          cost: newCost,
          summonedAllies: newSummonedUnits,
          standbyAllies: newStandbyUnits,
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
      const isEnemy = state.summonedEnemies.includes(unitToAction)

      const skillTargetGroup = unitToAction.searchTarget(
        isEnemy ? state.summonedAllies : state.summonedEnemies,
        isEnemy ? state.summonedEnemies : state.summonedAllies
      )
      if (skillTargetGroup.some(targets => targets.length)) {
        unitToAction.skill(...skillTargetGroup)

        return {
          ...state,
          summonedEnemies: state.summonedEnemies.filter(unit => unit.hp > 0),
          summonedAllies: state.summonedAllies.filter(unit => unit.hp > 0),
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
      const isGoalContainUnit = state.summonedEnemies.some(isBlocked) || state.summonedAllies.some(isBlocked)
      if (isGoalContainUnit) { return state }

      const newUnit = Object.assign(
        Object.create(Object.getPrototypeOf(unitToAction)),
        structuredClone(unitToAction)
      )
      newUnit.y = goalCoordinate.y
      const newEnemies = state.summonedEnemies.map(unit =>
        unit === unitToAction ? newUnit : unit
      )
      const newSummonedUnits = state.summonedAllies.map(unit =>
        unit === unitToAction ? newUnit : unit
      )

      return {
        ...state,
        summonedEnemies: state.summonedEnemies.includes(unitToAction) ? newEnemies : state.summonedEnemies,
        summonedAllies: state.summonedAllies.includes(unitToAction) ? newSummonedUnits : state.summonedAllies,
      }
    case 'turnEnd':
      return {
        ...state,
        cost: Math.min(state.cost + 1, COST_LIMIT)
      }
    case 'error':
      return {
        ...state,
        error: action.payload
      }
  }
  return state
}