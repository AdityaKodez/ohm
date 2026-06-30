"use client"

import { Moon, Sun } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render the icon after mount.
  useEffect(() => {
    setMounted(true)
  }, [])

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      onClick={toggle}
      className="relative size-9 overflow-hidden rounded-full border border-border bg-background/80 backdrop-blur-sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="size-4" />
            </motion.span>
          )
        ) : (
          // Placeholder to prevent layout shift before mount
          <span key="placeholder" className="size-4" />
        )}
      </AnimatePresence>
    </Button>
  )
}
