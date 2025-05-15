'use client'

import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme() 
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  useEffect(() => {
    if (isSystemDark) {
      setTheme('dark')
    }else{
      setTheme('light')
    }
  },[]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-8 w-8 px-0"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
} 