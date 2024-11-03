import { calcDistance } from "@app/common/utils/math"

export abstract class Unit {
  x = 0
  y = 0
  step = 1
  abstract reach: number
  abstract cost: number

  abstract maxHp: number
  abstract hp: number
  abstract atk: number
  abstract def: number

  abstract title: string
  abstract name: string
  abstract avatar: string

  /**
   * @param index for key of map
   */
  constructor(public index: number) { }

  summon(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  searchTarget(enemies: Unit[]): [Unit[], Unit[]]
  searchTarget(enemies: Unit[], allies: Unit[]): [Unit[], Unit[]]
  searchTarget(enemies: Unit[]) {
    const targets = enemies.filter(
      unit => calcDistance([this.x, this.y], [unit.x, unit.y]) <= this.reach
    )
    return [
      targets.slice(0, 1),
      []
    ]
  }

  abstract skill(enemies: Unit[], allies: Unit[]): void

  receiveAtk(value: number, from: Unit): void
  receiveAtk(value: number) {
    this.receiveDmg(value)
  }

  receiveDmg(value: number) {
    this.hp = Math.max(this.hp - value, 0)
  }

  abstract info: {
    passives: {
      title: string
      description: string
    }[]
    skill: {
      title: string
      description: string
    }
  }
}

export abstract class Shooter extends Unit {
  reach = 3
}

export abstract class Warrior extends Unit {
  reach = 1
}

export abstract class Tower extends Unit {
  step = 0
  reach = 3
}
