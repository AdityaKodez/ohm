"use client"

import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MathText } from "@/components/ui/math-text"
import { Textarea } from "@/components/ui/textarea"
import { type QuizQuestion, type UserAnswers } from "@/lib/quiz-schema"
import { cn } from "@/lib/utils"

export function QuestionPanel({
  question,
  index,
  total,
  answers,
  onAnswer,
  onNavigate,
}: {
  question: QuizQuestion
  index: number
  total: number
  answers: UserAnswers
  onAnswer: (questionId: string, value: string) => void
  onNavigate: (index: number) => void
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
            Q{index + 1}
          </span>
<div className="space-y-3">
        <p className="text-xs font-medium font-mono text-muted-foreground">
          {question.section === "mcq" && "Multiple Choice Question"}
          {question.section === "fill-blank" && "Fill in the Blanks Question"}
          {question.section === "assertion-reason" && "Assertion & Reason Question"}
          {question.section === "short-answer" && "Short Answer Question"}
        </p>
      </div>
          {answers[question.id]?.trim() && (
            <CheckCircle2 className="ml-auto size-5 text-primary" />
          )}
        </div>

        <h2 className="max-w-2xl text-lg font-medium font-heading leading-snug tracking-tight text-balance text-foreground sm:text-xl md:text-2xl">
          <MathText
            text={
              question.section === "assertion-reason"
                ? question.assertion
                : question.prompt
            }
          />
        </h2>
      </div>

      {question.section === "assertion-reason" && (
        <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.18em] text-primary">Reason</div>
            <div className="text-sm font-medium font-heading leading-relaxed text-foreground/90 md:text-base"><MathText text={question.reason} /></div>
          </div>

      )}

      <div className="space-y-4">
        {(question.section === "mcq" || question.section === "assertion-reason") && (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => {
              const isSelected = answers[question.id] === option
              const optionLabel = String.fromCharCode(65 + optionIndex)

              return (
                <button
                  key={option}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-2xl border  border-dashed px-4 py-3 text-left text-sm font-heading leading-relaxed transition-all",
                    isSelected
                      ? "border-primary bg-primary/12 text-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary),transparent_35%)]"
                      : "border-border/80 bg-card/70 text-foreground/90 hover:border-primary/45 hover:bg-accent/60"
                  )}
                  onClick={() => onAnswer(question.id, option)}
                  type="button"
                >
                   <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-wide transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary"
                    )}
                  >
                    {optionLabel}
                  </span>
                  <span><MathText text={option} /></span>
                </button>
              )
            })}
          </div>
        )}

        {question.section === "fill-blank" && (
          <div className="space-y-3 flex flex-col">
            <label className="text-xs text-foreground/90">Your Answer</label>
            <Input
              className="h-12 text-sm font-heading"
              value={answers[question.id] ?? ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Type your answer..."
            />
          </div>
        )}

        {question.section === "short-answer" && (
          <div className="space-y-2.5 flex flex-col">
            <label className="text-xs font-medium text-muted-foreground">Your Answer</label>
            <Textarea
              className="min-h-24 text-sm leading-relaxed"
              value={answers[question.id] ?? ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Write your answer..."
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t absolute bottom-0 left-0 w-full bg-background/90 px-4 py-4 backdrop-blur-sm sm:px-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate(index - 1)}
          disabled={index === 0}
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {index + 1} / {total}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate(index + 1)}
          disabled={index === total - 1}
        >
          Next
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  )
}
