"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only access theme after component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return {
    theme: mounted ? theme : undefined,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    setTheme,
    toggleTheme,
    isDark: mounted && resolvedTheme === "dark",
    isLight: mounted && resolvedTheme === "light",
  }
}
