export abstract class Unit {
  x = 0
  y = 0
  abstract step: number
  abstract reach: number

  abstract avatar: string

  summon(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }
}

export abstract class Shooter extends Unit {
  step = 1
  reach = 3
}

export abstract class Warrior extends Unit {
  step = 2
  reach = 1
}

export abstract class Tower extends Unit {
  step = 0
  reach = 3
}
