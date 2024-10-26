import { Block, BlockAreaType, getInitialBoard } from '@game/board'
import { FC, ReactNode, useEffect, useReducer, useRef, useState } from 'react'
import { BOARD_Y_COUNT, BOARD_X_COUNT, DOMAIN_LENGTH } from '../constants/board'
import { Unit } from '@game/unit/unit'
import { twMerge } from 'tailwind-merge'
import { stop } from '@app/common/utils/elementEvent'
import { reducer, SelectMode } from './reducer'
import { calcDistance } from '@app/common/utils/math'
import HpBar from '@app/common/components/hpBar'

const BoardBlock: FC<{
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLImageElement>
}> = ({ children, className = '', style, onClick }) => {
  return (<>
    <div onClick={onClick} className={twMerge(
      'w-24 h-24 border',
      className
    )} style={{
      maxWidth: `calc(85vw / ${BOARD_X_COUNT})`,
      maxHeight: `calc(85vw / ${BOARD_X_COUNT})`,
      ...style
    }}>{children}</div>
  </>)
}

const Units: FC<{
  units: Unit[]
  onClickUnit: (unit: Unit) => void
  isEnemy?: boolean
  blockSize: number
}> = ({ units, onClickUnit, isEnemy = false, blockSize }) => {

  return units.map((unit, index) => (
    <BoardBlock key={index}
      className='flex flex-col justify-center items-center gap-1 absolute border-0 transition-all'
      style={{
        left: unit.x * blockSize,
        bottom: unit.y * blockSize
      }}>
      <div className='space-y-1'>
        <img
          src={unit.avatar}
          className={twMerge(
            'cursor-pointer',
            isEnemy ? 'rotate-180' : ''
          )}
          onClick={() => onClickUnit(unit)}
        />
        <HpBar {...unit} className='w-full' innerBarClassName={isEnemy ? '' : 'bg-green-500'} />
      </div>
    </BoardBlock>
  ))
}

interface Props {
  team: Unit[]
  enemies: Unit[]
}

const BattleCore: FC<Props> = ({ team, enemies }) => {
  const board = useRef(getInitialBoard(BOARD_X_COUNT, BOARD_Y_COUNT, DOMAIN_LENGTH))

  const [state, dispatch] = useReducer(reducer, {
    selectedUnit: null,
    mode: null,
    standbyUnits: team,
    summonedUnits: [],
    enemies: enemies,
    error: null
  })

  useEffect(() => {
    const resetSelect = () => {
      dispatch({ type: 'clearSelection' })
    }

    document.body.addEventListener('click', resetSelect)
    return () => document.body.removeEventListener('click', resetSelect)
  }, [])

  const canSummon = (block: Block) => {
    return state.mode === SelectMode.summon && block.areaType === BlockAreaType.ally
  }

  const canMove = (block: Block) => {
    if (!state.selectedUnit) { return false }
    if (state.mode !== SelectMode.move) { return false }
    const distance = calcDistance(
      [state.selectedUnit.x, state.selectedUnit.y],
      [block.x, block.y]
    )
    return distance > 0 && distance <= state.selectedUnit.step
  }

  const canAttack = (target: { x: number, y: number }) => {
    if (!state.selectedUnit) { return false }
    if (state.mode !== SelectMode.attack) { return false }
    const distance = calcDistance(
      [state.selectedUnit.x, state.selectedUnit.y],
      [target.x, target.y]
    )
    return distance > 0 && distance <= state.selectedUnit.reach
  }

  const handleClickBoard = (block: Block) => {
    if (!canSummon(block) && !canMove(block)) { return }
    dispatch({ type: 'unitAction', payload: { block } })
  }

  const handleClickSummonedUnit = (unit: Unit) => {
    const mode = state.mode === SelectMode.move
      ? SelectMode.attack
      : SelectMode.move
    dispatch({
      type: 'selectUnit',
      payload: { unit, mode }
    })
  }

  const handleClickEnemyUnit = (target: Unit) => {
    if (canAttack(target)) {
      dispatch({
        type: 'attack',
        payload: { target }
      })
    }
  }

  const [blockSize, setBlockSize] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null!)
  useEffect(() => {
    const setSize = () => {
      const blockRef = boardRef.current.children[0] as HTMLDivElement
      setBlockSize(blockRef.getBoundingClientRect().width)
    }
    setSize()
    window.addEventListener('resize', setSize)
    return () => window.removeEventListener('resize', setSize)
  }, [])

  return (
    <>
      <div className='flex justify-center items-center w-screen min-h-screen'>
        <div className='flex flex-col md:flex-row gap-5 p-5'>
          <div className='grid border rounded-lg relative overflow-hidden' style={{
            gridTemplateColumns: `repeat(${BOARD_X_COUNT}, minmax(0, 1fr))`
          }} onClick={stop()} ref={boardRef}>
            {board.current.map(block => (
              <BoardBlock
                key={`${block.x},${block.y}`}
                className={twMerge(
                  canSummon(block) ? 'bg-slate-300 cursor-pointer' : '',
                  canMove(block) ? 'bg-green-300 cursor-pointer' : '',
                  canAttack(block) ? 'bg-red-300' : ''
                )}
                onClick={() => handleClickBoard(block)}
              />
            ))}

            <Units units={state.summonedUnits} onClickUnit={handleClickSummonedUnit} blockSize={blockSize} />

            <Units units={state.enemies} onClickUnit={handleClickEnemyUnit} isEnemy blockSize={blockSize} />
          </div>
          <div className='p-4 border rounded-lg' onClick={stop()}>
            <h3 className='mb-4 border-b font-bold text-center'>手牌區</h3>
            <div className='grid grid-cols-4 md:grid-cols-2 auto-rows-min items-start gap-4 md:w-32'>
              {state.standbyUnits.map((unit, index) => (
                <img
                  key={index} src={unit.avatar}
                  className='cursor-pointer'
                  onClick={() => dispatch({ type: 'selectUnit', payload: { unit, mode: SelectMode.summon } })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BattleCore