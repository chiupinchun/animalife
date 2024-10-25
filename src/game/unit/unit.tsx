export abstract class Unit {
  x = 0
  y = 0
  abstract avatar: string

  summon(x: number, y: number) {
    this.x = x
    this.y = y
    return this
  }
}

export abstract class Shooter extends Unit {

}

export abstract class Warrior extends Unit {

}

export abstract class Tower extends Unit {

}
