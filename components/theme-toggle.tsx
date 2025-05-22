"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeToggle } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeToggle()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`gap-2 rounded-full px-4 border-border transition-colors ${
        isDark 
          ? 'bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary' 
          : 'hover:bg-primary/10 hover:text-primary'
      }`}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <Sun size={16} className="text-primary" />
      ) : (
        <Moon size={16} />
      )}
      <span className="hidden sm:inline font-medium">
        {isDark ? "Claro" : "Oscuro"}
      </span>
    </Button>
  )
}
