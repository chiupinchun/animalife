import { FC } from 'react'
import homeBg from '@assets/animalife_bg.webp'
import { useMousePosition } from './hooks/mouse'
import HomeNav from './components/nav'

interface Props { }

const Home: FC<Props> = () => {
  const mousePosition = useMousePosition()

  const parallaxShift = mousePosition === 'left'
    ? '5%'
    : mousePosition === 'right'
      ? '-5%' : '0'

  return (
    <>
      <div className='relative w-screen h-screen overflow-hidden flex justify-center items-center'>
        <div
          className='w-full h-full bg-cover bg-center transition-all'
          style={{
            backgroundImage: `url(${homeBg})`,
            transform: `translateX(${parallaxShift}) scale(1.1)`
          }}
        />
        <HomeNav />
      </div>
    </>
  )
}

export default Home
