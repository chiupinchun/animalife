import { FC } from 'react'
import BattleCore from './components/core'
import { MercenaryJason } from '@game/unit/warrior/jack'
import { Team } from './components/reducer'
import { Unit } from '@game/unit/unit'
import { INITIAL_COST } from './constants/game'

const getFakeUnits = (count: number) => {
  const units: Unit[] = []
  for (let i = 0; i < count; i++) {
    units.push(new MercenaryJason(10, i))
  }
  return units
}

interface Props { }

const Page: FC<Props> = () => {
  const allies: Team = {
    leader: new MercenaryJason(10, 0),
    standby: getFakeUnits(6),
    summoned: [],
    cost: INITIAL_COST
  }

  const enemies: Team = {
    leader: new MercenaryJason(20, 0),
    standby: getFakeUnits(3),
    summoned: [],
    cost: INITIAL_COST
  }

  return (
    <>
      <BattleCore allies={allies} enemies={enemies} />
    </>
  )
}

export default Page
