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
  
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <>{children}</>}
    </NextThemesProvider>
  )
}
