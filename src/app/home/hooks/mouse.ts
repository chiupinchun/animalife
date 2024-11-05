import { useEffect, useState } from "react"

export const useMousePosition = () => {
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('center')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { screenX } = e
      const { innerWidth } = window
      setPosition(
        screenX < innerWidth / 4
          ? 'left'
          : screenX < innerWidth * 3 / 4
            ? 'center'
            : 'right'
      )
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  })

  return position
}