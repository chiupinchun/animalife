import { createHashRouter } from 'react-router-dom'
import App from './App'
import Map from '@app/map/page'
import Home from '@app/home/page'

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
        path: 'map',
        element: <Map />
      }
    ]
  }
])