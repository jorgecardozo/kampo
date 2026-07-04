'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Esperar a que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true)
    // Obtener el tema actual del DOM
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', newTheme)
  }

  // Evitar renderizar en el servidor para prevenir hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        disabled
      >
        <Moon className="h-5 w-5 text-yellow-500" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 bg-main-600 hover:bg-main-700 transition-colors group"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-white fill-white group-hover:text-black group-hover:fill-black transition-colors" />
            ) : (
              <Sun className="h-5 w-5 text-white fill-white group-hover:text-yellow-500 group-hover:fill-yellow-500 transition-colors" />
            )}
            <span className="sr-only">
              {theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
