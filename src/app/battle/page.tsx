import { FC } from 'react'
import BattleCore from './components/core'
import { MercenaryJason } from '@game/unit/warrior/jack'
import { Unit } from '@game/unit/unit'

interface Props { }

const Page: FC<Props> = () => {
  const team: Unit[] = []
  for (let i = 0; i < 6; i++) {
    team.push(new MercenaryJason(10, i))
  }

  const fakeEnemy = new MercenaryJason(20, 0)
  fakeEnemy.x = 2
  fakeEnemy.y = 6

  const enemies = [fakeEnemy]

  return (
    <>
      <BattleCore team={team} enemies={enemies} initialCost={7} />
    </>
  )
}

export default Page
