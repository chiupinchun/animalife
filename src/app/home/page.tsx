import { FC } from 'react'
import { Link } from 'react-router-dom'
import homeBg from '@assets/animalife_bg.webp'
import { useMousePosition } from './hooks/mouse'
import { links } from './configs/links'
import { twMerge } from 'tailwind-merge'

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
        >

        </div>
        <div className='fixed top-2 md:top-10 md:left-12 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8 md:w-[720px] md:h-[480px]'>
          {links.map(link => (
            <Link
              key={link.title}
              className={twMerge(
                'relative rounded-xl overflow-hidden md:w-full min-w-36 h-36 md:h-full border-8 bg-cover bg-center hover:scale-105 transition-all',
                link.wide ? 'col-span-2' : ''
              )}
              style={{
                backgroundImage: `url(${link.icon})`
              }}
              to={link.href}
            >
              <span className='absolute bottom-3 w-full font-bold text-xl md:text-2xl text-center bg-black bg-opacity-50 text-white py-1 rounded'>
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
