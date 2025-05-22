'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  
  // Solo renderiza el contenido completo después de montarse en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Apply smooth transition when changing theme
  useEffect(() => {
    document.documentElement.classList.add('transition-colors', 'duration-500')
    document.body.classList.add('transition-colors', 'duration-500')
    
    const allElements = document.querySelectorAll('*')
    allElements.forEach((el) => {
      if (el instanceof HTMLElement && !el.classList.contains('animate-spin')) {
        el.style.transition = 'background-color 500ms, border-color 500ms, color 500ms'
      }
    })
    
    return () => {
      document.documentElement.classList.remove('transition-colors', 'duration-500')
      document.body.classList.remove('transition-colors', 'duration-500')
    }
  }, [])
  
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <>{children}</>}
    </NextThemesProvider>
  )
}
