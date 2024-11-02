import { Unit } from "@game/unit/unit"

export interface Team {
  leader: Unit
  standby: Unit[]
  summoned: Unit[]
  cost: number
}

export interface BattleCtx {
  allies: Team
  enemies: Team
}
