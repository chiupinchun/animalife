import { Block } from "@game/board";
import { Unit } from "@game/unit/unit";
import { Reducer } from "react";

export enum SelectMode {
  summon,
  move,
  attack
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
  type: 'attack',
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
        case SelectMode.move:
          selectedUnit.summon(block.x, block.y)
          return {
            ...state,
            selectedUnit: null,
            mode: null
          }
      }
      break
    case 'attack':
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