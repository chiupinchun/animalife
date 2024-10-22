import { getInitialBoard } from '@game/board'
import { FC, useRef } from 'react'
import { BOARD_Y_COUNT, BOARD_X_COUNT } from './constants/board'

interface Props { }

const Battle: FC<Props> = () => {
  const board = useRef(getInitialBoard(BOARD_X_COUNT, BOARD_Y_COUNT))

  return (
    <>
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='grid border rounded-lg overflow-hidden' style={{
          gridTemplateColumns: `repeat(${BOARD_X_COUNT}, minmax(0, 1fr))`
        }}>
          {board.current.map(block => (
            <div
              key={`${block.x},${block.y}`}
              className='w-24 h-24 border'
              style={{
                maxWidth: `calc(90vw / ${BOARD_X_COUNT})`,
                maxHeight: `calc(90vw / ${BOARD_X_COUNT})`,
              }}
            >({block.x}, {block.y})</div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Battle
