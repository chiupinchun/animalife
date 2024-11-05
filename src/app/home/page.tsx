import { FC } from 'react'
import { Link } from 'react-router-dom'
import homeBg from '@assets/animalife_bg.webp'
import { useMousePosition } from './hooks/mouse'

interface Props { }

const Home: FC<Props> = () => {
  const mousePosition = useMousePosition()

  const parallaxShift = mousePosition === 'left'
    ? '5%'
    : mousePosition === 'right'
      ? '-5%' : '0'

  return (
    <div className='relative w-screen h-screen overflow-hidden flex justify-center items-center'>
      <div
        className='absolute top-0 w-full h-full bg-cover bg-center transition-all'
        style={{
          backgroundImage: `url(${homeBg})`,
          transform: `translateX(${parallaxShift}) scale(1.1)`
        }}
      ></div>
    </div>
  )
}

export default Home
