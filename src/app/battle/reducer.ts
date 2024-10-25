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
}

export const reducer: Reducer<ReducerState, ReducerAction> = (state, action) => {
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
      switch (state.mode) {
        case SelectMode.summon:
          const unit = state.selectedUnit
          const block = action.payload.block
          if (!unit) {
            return { ...state, error: '未選擇要部署的角色。' }
          }
          state.summonedUnits.push(unit.summon(block.x, block.y))

          const index = state.standbyUnits.indexOf(unit)
          state.standbyUnits.splice(index, 1)

          return {
            ...state,
            selectedUnit: null,
            mode: null
          }
      }
  }
  return state
}