import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <h1 className='text-pink-300'>Doggy</h1>
      <Outlet />
    </>
  )
}

export default App
