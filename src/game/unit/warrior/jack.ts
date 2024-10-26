import { Unit, Warrior } from "../unit";
import Avatar from '@assets/defaultAvatar.webp'

export class Jack extends Warrior {
  avatar = Avatar

  maxHp: number
  hp: number
  atk: number
  def: number

  constructor(lv: number) {
    super()

    this.maxHp = this.hp = lv
    this.atk = lv
    this.def = lv
  }

  skill(target: Unit): void {
    const baseDmg = 3
    const realDmg = Math.floor(baseDmg * this.atk / target.def)
    target.receiveDmg(realDmg)
  }
}