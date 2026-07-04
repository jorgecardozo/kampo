import { useState, useEffect } from 'react'

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(null)
  const resize = () => {
    setBreakpoint(window.innerWidth)
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return {
    xs: breakpoint < 640,
    sm: breakpoint >= 640 && breakpoint < 768,
    md: breakpoint >= 768 && breakpoint < 1024,
    lg: breakpoint >= 1024 && breakpoint < 1280,
    xl: breakpoint >= 1280 && breakpoint < 1536,
    xxl: breakpoint >= 1536,
  }
}
