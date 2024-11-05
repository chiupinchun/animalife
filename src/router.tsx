import { createHashRouter } from 'react-router-dom'
import App from './App'
import Farm from '@app/farm/page'
import Home from '@app/home/page'
import Battle from '@app/battle/page'

export const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'battle',
        element: <Battle />
      },
      {
        path: 'farm',
        element: <Farm />
      }
    ]
  }
])