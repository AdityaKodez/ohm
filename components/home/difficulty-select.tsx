"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { difficulties, getDifficultyOption } from "@/lib/difficulty"
import { type Difficulty } from "@/lib/quiz-schema"

export function DifficultySelect({
  value,
  onValueChange,
  disabled,
}: {
  value: Difficulty
  onValueChange: (value: Difficulty) => void
  disabled?: boolean
}) {
  const selectedDifficulty = getDifficultyOption(value)

  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as Difficulty)}
      disabled={disabled}
    >
      <SelectTrigger className="h-9 rounded-full bg-muted/50 text-xs sm:w-28">
        <SelectValue>
          <span aria-hidden="true">{selectedDifficulty.icon}</span>
          <span className="hidden truncate sm:inline">
            {selectedDifficulty.label}
          </span>
          <span className="sr-only sm:hidden">
            {selectedDifficulty.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {difficulties.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.icon} {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
