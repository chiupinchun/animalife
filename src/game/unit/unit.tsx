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

  abstract avatar: string

  summon(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }

  abstract skill(target: Unit): void
  receiveDmg(value: number) {
    this.hp = Math.max(this.hp - value, 0)
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
