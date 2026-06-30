"use client"

import { CheckCircle2, RotateCcw, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { AnswerReview } from "@/components/stats/answer-review"
import { InsightNotes } from "@/components/stats/insight-notes"
import { PerformanceCharts } from "@/components/stats/performance-charts"
import { ScoreHeader } from "@/components/stats/score-header"
import { Shell } from "@/components/stats/shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuizResult } from "@/hooks/use-quiz-result"
import { compactSectionLabel, getAnswerFill, getScoreFill } from "@/lib/stats-format"

export function StatsDashboard({ id }: { id: string }) {
  const { result, quiz, loadError } = useQuizResult(id)
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false)

  const filteredAnswers = useMemo(() => {
    if (!result) return []
    if (!showIncorrectOnly) return result.evaluatedAnswers
    return result.evaluatedAnswers.filter((a) => a.status !== "correct")
  }, [result, showIncorrectOnly])

  const answerIndexById = useMemo(() => {
    if (!result) return new Map<string, number>()

    return new Map(
      result.evaluatedAnswers.map((answer, index) => [answer.questionId, index])
    )
  }, [result])

  const stats = useMemo(() => {
    if (!result) return null

    const correct = result.evaluatedAnswers.filter(
      (answer) => answer.status === "correct"
    ).length
    const partial = result.evaluatedAnswers.filter(
      (answer) => answer.status === "partial"
    ).length
    const incorrect = result.evaluatedAnswers.length - correct - partial

    return { correct, partial, incorrect }
  }, [result])

  const sectionChartData = useMemo(() => {
    if (!result) return []

    return result.sectionPerformance
      .filter((section) => section.total > 0)
      .map((section) => ({
        section: section.label,
        shortLabel: compactSectionLabel(section.label),
        score: Math.round(section.score),
        correct: section.correct,
        total: section.total,
        fill: getScoreFill(section.score),
      }))
  }, [result])

  const questionChartData = useMemo(() => {
    if (!result) return []

    return result.evaluatedAnswers.map((answer, index) => ({
      question: `Q${index + 1}`,
      score: Math.round(answer.score * 100),
      status: answer.status,
      fill: getAnswerFill(answer.status),
    }))
  }, [result])


  if (loadError || !result || !stats) {
    return (
      <Shell>
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Stats unavailable</CardTitle>
            <CardDescription>
              {loadError ||
                "Results are stored in this browser session after submitting a quiz."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Create a new quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-end">
          <Button variant="default" size="lg" asChild>
            <Link href="/">
              <RotateCcw data-icon="inline-start" />
              New quiz
            </Link>
          </Button>
        </div>

        <ScoreHeader quiz={quiz} score={result.score} />

        <AnswerReview
          filteredAnswers={filteredAnswers}
          answerIndexById={answerIndexById}
          showIncorrectOnly={showIncorrectOnly}
          onToggle={() => setShowIncorrectOnly(!showIncorrectOnly)}
        />

        <PerformanceCharts
          sectionChartData={sectionChartData}
          questionChartData={questionChartData}
        />

        <div className="grid gap-5 border-t pt-5 md:grid-cols-2 md:items-start">
          <InsightNotes
            title="What went well"
            description="Patterns you handled with confidence."
            icon={<CheckCircle2 aria-hidden className="h-4 w-4 text-success" />}
            items={result.strengths}
            emptyMessage="No clear strengths surfaced this time — keep practicing."
          />
          <InsightNotes
            title="Needs attention"
            description="The next places to slow down and review."
            icon={<Target aria-hidden className="h-4 w-4 text-destructive" />}
            items={result.weakAreas}
            emptyMessage="Nothing flagged for review — solid work."
          />
        </div>

        <section className="pt-5">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-lg font-medium">Next moves</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Short actions to make the next attempt better.
          </p>
          {result.suggestions.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed px-3 py-2 text-sm leading-6 text-muted-foreground">
              No suggestions for this attempt.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2">
              {result.suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="rounded-lg bg-muted/50 px-3 py-2 text-sm leading-6 text-muted-foreground"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  )
}
