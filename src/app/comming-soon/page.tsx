import { FC, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bg from '@assets/prairie-dog-moving.gif'

interface Props { }

const CommingSoon: FC<Props> = () => {
  const navigate = useNavigate()

  const [count, setCount] = useState(0)
  const bgSize = useMemo(() => {
    const rate = 100 / Math.pow(2, count % 3)
    return `${rate}% ${rate}%`
  }, [count])

  useEffect(() => {
    setTimeout(() => {
      setCount(count => count + 1)
    }, 500)
  }, [count])

  return (
    <>
      <div
        className="flex justify-center items-center w-screen h-screen max-w-full max-h-full"
        style={{
          backgroundSize: bgSize,
          backgroundImage: `url(${bg})`
        }}>
        <div className="space-y-2 p-5 w-1/3 border rounded shadow bg-sky-100">
          <h1 className="mb-3 text-center text-lg font-bold">Coming Soon!</h1>
          <p>
            頁面正在努力趕工中
            {new Array(count % 4).fill('.')}
            {count % 2 ? '*(´ω｀*)' : '(*\'ω `)*'}
          </p>
          <p>返回<a className="text-sky-500 font-bold cursor-pointer" onClick={() => navigate(-1)}>上一頁</a></p>
          <p>或回<Link className="text-sky-500 font-bold" to="/">首頁</Link>逛逛吧～</p>
        </div>
      </div>
    </>
  )
}

export default CommingSoon
