import { Block, BlockAreaType, getInitialBoard } from '@game/board'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { BOARD_Y_COUNT, BOARD_X_COUNT, DOMAIN_LENGTH } from './constants/board'
import { Unit } from '@game/unit/unit'
import { Jack } from '@game/unit/tower/jack'
import { twMerge } from 'tailwind-merge'
import { stop } from '@app/common/utils/elementEvent'

enum SelectMode {
  summon,
  move,
  attack
}

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
      maxWidth: `calc(90vw / ${BOARD_X_COUNT})`,
      maxHeight: `calc(90vw / ${BOARD_X_COUNT})`,
      ...style
    }}>{children}</div>
  </>)
}

interface Props { }

const Battle: FC<Props> = () => {
  const board = useRef(getInitialBoard(BOARD_X_COUNT, BOARD_Y_COUNT, DOMAIN_LENGTH))
  const [standbyUnits, setStandbyUnits] = useState<Unit[]>([])
  const [summonedUnits, setSummonedUnits] = useState<Unit[]>([])

  useEffect(() => {
    const units: Unit[] = []
    for (let i = 0; i < 6; i++) {
      units.push(new Jack())
    }
    setStandbyUnits(units)
  }, [])

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [selectMode, setSelectMode] = useState<SelectMode | null>(null)

  useEffect(() => {
    const resetSelect = () => {
      setSelectedUnit(null)
      setSelectMode(null)
    }

    document.body.addEventListener('click', resetSelect)
    return () => document.body.removeEventListener('click', resetSelect)
  }, [])

  const handleSelect = (unit: Unit | null, mode: SelectMode | null) => {
    setSelectedUnit(unit)
    setSelectMode(mode)
  }

  const canSummon = (block: Block) => {
    return selectMode === SelectMode.summon && block.areaType === BlockAreaType.ally
  }

  const handleClickBlock = (block: Block) => {
    if (!selectedUnit) { return }
    if (canSummon(block)) {
      summonedUnits.push(selectedUnit.summon(block.x, block.y))
      setSummonedUnits([...summonedUnits])

      const index = standbyUnits.indexOf(selectedUnit)
      standbyUnits.splice(index, 1)
      setStandbyUnits([...standbyUnits])

      handleSelect(null, null)
    }
  }

  const [blockSize, setBlockSize] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null!)
  useEffect(() => {
    const setSize = () => {
      const blockRef = boardRef.current.children[0] as HTMLDivElement
      setBlockSize(blockRef.offsetWidth)
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
                onClick={() => handleClickBlock(block)}
              >
                {/* ({block.x}, {block.y}) */}
              </BoardBlock>
            ))}
            {summonedUnits.map((unit, index) => (
              <BoardBlock key={index} className='flex justify-center items-center absolute border-0' style={{
                left: unit.x * blockSize,
                bottom: unit.y * blockSize
              }}>
                <img
                  src={unit.avatar}
                  className='cursor-pointer'
                  onClick={() => { }}
                />
              </BoardBlock>
            ))}
          </div>
          <div className='p-4 border rounded-lg' onClick={stop()}>
            <h3 className='mb-4 border-b font-bold text-center'>手牌區</h3>
            <div className='grid grid-cols-4 md:grid-cols-2 auto-rows-min items-start gap-4'>
              {standbyUnits.map((unit, index) => (
                <img
                  key={index} src={unit.avatar}
                  className='cursor-pointer'
                  onClick={() => handleSelect(unit, SelectMode.summon)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Battle
