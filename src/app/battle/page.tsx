import { FC } from 'react'
import BattleCore from './components/core'
import { Jack } from '@game/unit/warrior/jack'
import { Unit } from '@game/unit/unit'

interface Props { }

const Page: FC<Props> = () => {
  const team: Unit[] = []
  for (let i = 0; i < 6; i++) {
    team.push(new Jack(10))
  }

  const fakeEnemy = new Jack(20)
  fakeEnemy.x = 2
  fakeEnemy.y = 6

  const enemies = [fakeEnemy]

  return (
    <>
      <BattleCore team={team} enemies={enemies} />
    </>
  )
}

export default Page
