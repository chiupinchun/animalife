import { Block, BlockAreaType, getInitialBoard } from '@game/board'
import { FC, ReactNode, useEffect, useReducer, useRef, useState } from 'react'
import { BOARD_Y_COUNT, BOARD_X_COUNT, DOMAIN_LENGTH } from '../constants/game'
import { Unit } from '@game/unit/unit'
import { twMerge } from 'tailwind-merge'
import { stop } from '@app/common/utils/elementEvent'
import { reducer } from './reducer'
import HpBar from '@app/common/components/hpBar'
import { Badge, Button, Snackbar } from '@mui/material'
import { BattleCtx, Team } from '@game/types/battle'

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

const UnitComponent: FC<{
  unit: Unit
  onClick?: () => void
  isEnemy?: boolean
  isCastingSkill?: boolean
  blockSize: number
}> = ({ unit, onClick, isEnemy = false, isCastingSkill = false, blockSize }) => {

  return <BoardBlock key={unit.index}
    className='flex flex-col justify-center items-center gap-1 absolute border-0 transition-all'
    style={{
      left: unit.x * blockSize,
      bottom: unit.y * blockSize
    }}>
    <div className='space-y-1'>
      <img
        src={unit.avatar}
        className={twMerge(
          'cursor-pointer transition-all',
          isEnemy ? 'rotate-180' : '',
          isCastingSkill ? 'shadow-[0_0_15px_rgba(0,205,255,0.8)] animate-pulse' : ''
        )}
        onClick={onClick}
      />
      <HpBar {...unit} className='w-full' innerBarClassName={isEnemy ? '' : 'bg-green-500'} />
    </div>
  </BoardBlock>
}

enum TurnPhase {
  allyAction,
  summonAlly,
  enemyAction,
  summonEnemy
}

interface Props {
  allies: Team
  enemies: Team
  onBattleEnd: (battleCtx: BattleCtx & {
    isWin: boolean
  }) => void
}

const BattleCore: FC<Props> = ({ allies, enemies, onBattleEnd }) => {
  const board = useRef(getInitialBoard(BOARD_X_COUNT, BOARD_Y_COUNT, DOMAIN_LENGTH))

  allies.leader.x = enemies.leader.x = Math.floor(BOARD_X_COUNT / 2)
  allies.leader.y = 0
  enemies.leader.y = BOARD_Y_COUNT - 1
  const [state, dispatch] = useReducer(reducer, {
    allies,
    enemies,
    selectedUnit: null,
    skillProcess: {
      castingUnit: null,
      targetGroup: [[], []]
    },

    error: null
  })

  const [turnPhase, setTurnPhase] = useState(TurnPhase.summonAlly)
  useEffect(() => {
    const handleUnitActions = async (units: Unit[], onFinished: () => void) => {
      for (let i = 0; i < units.length; i++) {
        dispatch({
          type: 'action',
          payload: { unit: units[i] }
        })
        await new Promise(resolve => setTimeout(resolve, 200))
        dispatch({ type: 'actionEnd' })
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      onFinished()
    }

    switch (turnPhase) {
      case TurnPhase.allyAction:
        handleUnitActions(
          state.allies.summoned.concat(state.allies.leader),
          () => setTurnPhase(phase => phase + 1)
        )
        break
      case TurnPhase.summonAlly:
        break
      case TurnPhase.enemyAction:
        handleUnitActions(
          state.enemies.summoned.concat(state.enemies.leader),
          () => setTurnPhase(phase => phase + 1)
        )
        break
      case TurnPhase.summonEnemy:
        dispatch({ type: 'summonEnemy' })
        setTurnPhase(TurnPhase.allyAction)
        break
    }

    if (state.allies.leader.hp <= 0 || state.enemies.leader.hp <= 0) {
      onBattleEnd({
        isWin: state.enemies.leader.hp <= 0,
        allies: state.allies,
        enemies: state.enemies
      })
    }
  }, [turnPhase])

  useEffect(() => {
    const resetSelect = () => {
      dispatch({ type: 'clearSelection' })
    }

    document.body.addEventListener('click', resetSelect)
    return () => document.body.removeEventListener('click', resetSelect)
  }, [])

  const canSummon = (block: Block) => {
    return state.selectedUnit && block.areaType === BlockAreaType.ally
  }

  const handleClickStandbyUnit = (unit: Unit) => {
    if (turnPhase !== TurnPhase.summonAlly) { return }
    if (state.allies.cost < unit.cost) {
      dispatch({ type: 'error', payload: '資源不足。' })
      return
    }
    dispatch({ type: 'selectUnit', payload: { unit } })
  }

  const handleClickBoard = (block: Block) => {
    if (!canSummon(block)) { return }
    dispatch({ type: 'summonAlly', payload: { block } })
  }

  const handleTurnEnd = () => {
    if (turnPhase !== TurnPhase.summonAlly) { return }
    setTurnPhase(phase => phase + 1)
    dispatch({ type: 'turnEnd' })
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
                  canSummon(block) ? 'bg-slate-300 cursor-pointer' : ''
                )}
                onClick={() => handleClickBoard(block)}
              />
            ))}

            <UnitComponent
              unit={state.allies.leader} blockSize={blockSize}
              isCastingSkill={state.skillProcess.castingUnit === state.allies.leader}
            />
            {state.allies.summoned.map(unit => (
              <UnitComponent
                key={unit.index} unit={unit} blockSize={blockSize}
                isCastingSkill={state.skillProcess.castingUnit === unit}
              />
            ))}

            <UnitComponent
              unit={state.enemies.leader} isEnemy blockSize={blockSize}
              isCastingSkill={state.skillProcess.castingUnit === state.enemies.leader}
            />
            {state.enemies.summoned.map(unit => (
              <UnitComponent
                key={unit.index} unit={unit} isEnemy blockSize={blockSize}
                isCastingSkill={state.skillProcess.castingUnit === unit}
              />
            ))}
          </div>
          <div className='flex flex-col justify-between p-4 border rounded-lg' onClick={stop()}>
            <div>
              <div className='flex justify-between mb-4 border-b font-bold'>手牌區</div>
              <div className='grid grid-cols-4 md:grid-cols-2 auto-rows-min gap-4 md:w-32'>
                {state.allies.standby.map((unit, index) => (
                  <Badge key={index} badgeContent={unit.cost} color="primary">
                    <img src={unit.avatar}
                      className='cursor-pointer'
                      onClick={() => handleClickStandbyUnit(unit)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <div className='border-t'>
              <div className='flex justify-between my-1'>
                可用資源：
                <span>{state.allies.cost}</span>
              </div>
              <Button onClick={handleTurnEnd} className='w-full' variant="contained">回合結束</Button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        message={state.error} open={!!state.error} autoHideDuration={1000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => dispatch({ type: 'error', payload: null })}
      />
    </>
  )
}

export default BattleCore
