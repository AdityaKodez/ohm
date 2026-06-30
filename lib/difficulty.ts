import { type Difficulty } from "@/lib/quiz-schema"

export type DifficultyOption = {
  icon: string
  value: Difficulty
  label: string
}

/** Shared difficulty metadata — emoji + label used on the home creator and the stats report. */
export const difficulties: DifficultyOption[] = [
  { icon: "🌱", value: "easy", label: "Easy" },
  { icon: "⚖️", value: "balanced", label: "Balanced" },
  { icon: "🔥", value: "challenging", label: "Challenging" },
]

/** Looks up a difficulty option, falling back to "Balanced" for unknown values. */
export function getDifficultyOption(value: Difficulty): DifficultyOption {
  return difficulties.find((item) => item.value === value) ?? difficulties[1]
}
