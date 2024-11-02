import { Unit, Warrior } from "../unit";
import Avatar from '@assets/defaultAvatar.webp'

export class MercenaryJason extends Warrior {
  avatar = Avatar
  name = '傑森'
  title = '傭兵護衛'

  cost = 3
  maxHp: number
  hp: number
  atk: number
  def: number

  constructor(lv: number, index: number) {
    super(index)

    this.maxHp = this.hp = lv
    this.atk = lv
    this.def = lv
  }

  skill(targets: Unit[]): void {
    const [target] = targets
    const baseDmg = 3
    const realDmg = Math.floor(baseDmg * this.atk / target.def)
    target.receiveDmg(realDmg)
  }
}