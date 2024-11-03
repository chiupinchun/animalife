import { Block } from "@game/board";
import { Unit } from "@game/unit/unit";
import { Reducer } from "react";
import { BOARD_Y_COUNT, COST_LIMIT } from "../constants/game";
import { getAutoSummonCoordinate } from "../utils/game";
import { Team } from "@game/types/battle";

export interface ReducerState {
  selectedUnit: Unit | null
  allies: Team
  enemies: Team

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
  type: 'summonAlly',
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
  type: 'summonEnemy'
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
    case 'summonAlly':
      const { block } = action.payload

      if (!selectedUnit) {
        return { ...state, error: '未選擇要部署的角色。' }
      }

      if (state.allies.cost >= selectedUnit.cost) {
        const newCost = state.allies.cost - selectedUnit.cost;
        const newSummonedUnits = [...state.allies.summoned, selectedUnit.summon(block.x, block.y)];
        const newStandbyUnits = state.allies.standby.filter((unit) => unit !== selectedUnit);

        return {
          ...state,
          allies: {
            ...state.allies,
            summoned: newSummonedUnits,
            standby: newStandbyUnits,
            cost: newCost
          },
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
      const allyTargets = state.allies.summoned.concat(state.allies.leader)
      const enemyTargets = state.enemies.summoned.concat(state.enemies.leader)
      const isEnemy = state.enemies.summoned.includes(unitToAction)
        || unitToAction === state.enemies.leader

      const skillTargetGroup = unitToAction.searchTarget(
        isEnemy ? allyTargets : enemyTargets,
        isEnemy ? enemyTargets : allyTargets
      )
      if (skillTargetGroup.some(targets => targets.length)) {
        unitToAction.skill(...skillTargetGroup)

        return {
          ...state,
          enemies: {
            ...state.enemies,
            summoned: state.enemies.summoned.filter(unit => unit.hp > 0)
          },
          allies: {
            ...state.allies,
            summoned: state.allies.summoned.filter(unit => unit.hp > 0)
          },
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
      const isGoalContainUnit = enemyTargets.some(isBlocked) || allyTargets.some(isBlocked)
      if (isGoalContainUnit) { return state }

      const newUnit = Object.assign(
        Object.create(Object.getPrototypeOf(unitToAction)),
        structuredClone(unitToAction)
      )
      newUnit.y = goalCoordinate.y
      const newEnemies = state.enemies.summoned.map(unit =>
        unit === unitToAction ? newUnit : unit
      )
      const newSummonedUnits = state.allies.summoned.map(unit =>
        unit === unitToAction ? newUnit : unit
      )

      return {
        ...state,
        enemies: {
          ...state.enemies,
          summoned: state.enemies.summoned.includes(unitToAction) ? newEnemies : state.enemies.summoned
        },
        allies: {
          ...state.allies,
          summoned: state.allies.summoned.includes(unitToAction) ? newSummonedUnits : state.allies.summoned
        }
      }
    case 'turnEnd':
      return {
        ...state,
        allies: {
          ...state.allies,
          cost: Math.min(state.allies.cost + 1, COST_LIMIT)
        },
        enemies: {
          ...state.enemies,
          cost: Math.min(state.enemies.cost + 1, COST_LIMIT)
        }
      }
    case 'summonEnemy':
      const standbyEnemyUnits = [...state.enemies.standby]
      const summonedEnemyUnits = [...state.enemies.summoned]
      let enemyCost = state.enemies.cost
      while (
        standbyEnemyUnits[0]
        && standbyEnemyUnits[0].cost <= enemyCost
      ) {
        const unit = standbyEnemyUnits.shift()!
        const coordinate = getAutoSummonCoordinate([
          state.allies.leader,
          ...state.allies.summoned,
          state.enemies.leader,
          ...summonedEnemyUnits
        ], true)
        if (coordinate) {
          summonedEnemyUnits.push(unit.summon(coordinate.x, coordinate.y))
          enemyCost -= unit.cost
        }
      }
      return {
        ...state,
        enemies: {
          ...state.enemies,
          standby: standbyEnemyUnits,
          summoned: summonedEnemyUnits,
          cost: enemyCost
        }
      }
    case 'error':
      return {
        ...state,
        error: action.payload
      }
  }
  return state
}