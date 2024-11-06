import { FC } from 'react'
import { links } from '../configs/links'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

interface Props { }

const HomeNav: FC<Props> = () => {
  return (
    <>
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
    </>
  )
}

export default HomeNav
