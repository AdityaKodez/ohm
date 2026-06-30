import { type ChartConfig } from "@/components/ui/chart"
import { type QuizResult } from "@/lib/quiz-schema"

export const sectionChartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export const questionChartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function compactSectionLabel(label: string) {
  return label
    .replace("Multiple Choice", "MCQ")
    .replace("Fill in the Blanks", "Fill")
    .replace("Assertion & Reason", "A/R")
    .replace("Short Answer", "Short")
}

export function getAnswerFill(
  status: QuizResult["evaluatedAnswers"][number]["status"]
) {
  if (status === "correct") return "var(--chart-1)"
  if (status === "partial") return "var(--chart-2)"

  return "var(--destructive)"
}

export function getStatusVariant(
  status: QuizResult["evaluatedAnswers"][number]["status"],
  missed?: boolean
) {
  if (missed) return "outline"
  if (status === "incorrect") return "destructive"
  if (status === "partial") return "secondary"

  return "default"
}

export function getScoreColor(score: number) {
  if (score < 40) return "text-destructive"
  if (score < 70) return "text-amber-600"
  return "text-green-600"
}

export function getScoreBarColor(score: number) {
  if (score < 40) return "bg-destructive"
  if (score < 70) return "bg-amber-500"
  return "bg-green-600"
}

export function getScoreFill(score: number) {
  if (score < 40) return "hsl(var(--destructive))"
  if (score < 70) return "hsl(45 93% 47%)"
  return "hsl(142 71% 45%)"
}
