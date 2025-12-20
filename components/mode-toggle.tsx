"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 dark:bg-blue-600"
      aria-label="Toggle theme"
    >
      {/* Toggle Circle */}
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {/* Icon inside circle */}
        <span className="flex items-center justify-center h-full w-full">
          {isDark ? (
            <Moon className="h-3 w-3 text-blue-600" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </span>

      {/* Background Icons */}
      <span className="absolute left-1.5 top-1">
        <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-50 text-gray-500'}`} />
      </span>
      <span className="absolute right-1.5 top-1">
        <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-100 text-white' : 'opacity-0'}`} />
      </span>
    </button>
  )
}
