import { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props { }

const Home: FC<Props> = () => {
  return (
    <>
      <div className='w-screen h-screen flex justify-center items-center'>
        <Link to='/farm'>進入遊戲</Link>
      </div>
    </>
  )
}

export default Home
