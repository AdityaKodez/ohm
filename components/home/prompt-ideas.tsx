"use client"

import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { openingItem, promptIdeas } from "@/lib/home"

export function PromptIdeas({ onSelect }: { onSelect: (idea: string) => void }) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2"
      variants={openingItem}
    >
      {promptIdeas.map((idea) => (
        <Badge
          key={idea}
          className="h-7 cursor-pointer px-3 text-xs font-medium font-heading text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          variant="outline"
          asChild
        >
          <button type="button" onClick={() => onSelect(idea)}>
            {idea}
          </button>
        </Badge>
      ))}
    </motion.div>
  )
}
