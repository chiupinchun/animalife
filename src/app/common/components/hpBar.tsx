import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  maxHp: number
  hp: number
  className?: string
  innerBarClassName?: string
}

const HpBar: FC<Props> = ({ maxHp, hp, className, innerBarClassName }) => {
  return (
    <>
      <div className={twMerge('relative border border-slate-300 rounded overflow-hidden', className)}>
        <div
          style={{ width: hp / maxHp * 100 + '%' }}
          className={twMerge('h-4 rounded bg-red-500 transition-all', innerBarClassName)}
        />
        <div className='absolute top-0 flex justify-center items-center w-full h-full text-slate-300 text-sm'>
          {hp} / {maxHp}
        </div>
      </div>
    </>
  )
}

export default HpBar
