import { Badge } from "@/components/ui/badge"
import { getDifficultyOption } from "@/lib/difficulty"
import { type Quiz } from "@/lib/quiz-schema"
import { getScoreBarColor, getScoreColor } from "@/lib/stats-format"

export function ScoreHeader({
  quiz,
  score,
}: {
  quiz: Quiz | null
  score: number
}) {
  const difficulty = quiz ? getDifficultyOption(quiz.difficulty) : null

  return (
    <section className="flex flex-col gap-4 border-b pb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Quiz Report
          </p>
          <h1 className="mt-1 font-heading text-xl font-medium tracking-tight text-balance text-foreground sm:text-2xl">
            {quiz?.title ?? "Session results"}
          </h1>
          {quiz?.sourceSummary ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {quiz.sourceSummary}
            </p>
          ) : null}
        </div>
        <Badge variant="outline" className="h-7 shrink-0 gap-1.5 text-xs">
          {difficulty ? (
            <>
              <span aria-hidden="true">{difficulty.icon}</span>
              {difficulty.label} difficulty
            </>
          ) : (
            "Evaluated"
          )}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr] sm:items-end">
        <div className="min-w-0">
          <div className="flex items-end gap-3">
            <div
              className={`font-heading text-4xl leading-none font-medium tracking-tight sm:text-5xl ${getScoreColor(score)}`}
            >
              {Math.round(score)}%
            </div>
            <div className="pb-1 text-sm text-muted-foreground">
              Overall score
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${getScoreBarColor(score)}`}
              style={{ width: `${Math.round(score)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
