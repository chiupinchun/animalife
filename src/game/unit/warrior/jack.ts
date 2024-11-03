import { getRandomByRate } from "@app/common/utils/math";
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

  step = 2

  receiveAtk(value: number, from: Unit): void {
    const isDodged = getRandomByRate(0.1)
    if (!isDodged) {
      super.receiveAtk(value, from)
    }
  }

  get baseDmg() {
    return Math.floor(1.1 * this.atk + 10)
  }
  skill(targets: Unit[]): void {
    const [target] = targets
    const realDmg = Math.max(this.baseDmg - target.def, 0)
    target.receiveAtk(realDmg, this)
  }

  info = {
    passives: [
      {
        title: '衝鋒',
        description: '每次移動前進2格。'
      },
      {
        title: '迷彩',
        description: '被攻擊時，有10%機率不會受到傷害。'
      }
    ],
    skill: {
      title: '重擊',
      description: `造成${this.baseDmg}點傷害。`
    }
  }
}