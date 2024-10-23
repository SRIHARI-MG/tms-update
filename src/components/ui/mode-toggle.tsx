import React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-10 w-10 overflow-hidden"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-300 ease-in-out" />
      <Moon className="h-[1.2rem] w-[1.2rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-300 ease-in-out" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}