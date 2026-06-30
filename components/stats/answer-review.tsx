import { CheckCircle2, Minus, XCircle } from "lucide-react"

import { MathText } from "@/components/ui/math-text"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type QuizResult } from "@/lib/quiz-schema"
import { getStatusVariant } from "@/lib/stats-format"

export type AnswerFilter = "all" | "correct" | "missed" | "incorrect"

function isMissed(answer: QuizResult["evaluatedAnswers"][number]) {
  return answer.status === "incorrect" && !answer.userAnswer?.trim()
}

export function AnswerReview({
  filteredAnswers,
  answerIndexById,
  filter,
  onFilterChange,
}: {
  filteredAnswers: QuizResult["evaluatedAnswers"]
  answerIndexById: Map<string, number>
  filter: AnswerFilter
  onFilterChange: (value: AnswerFilter) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-medium">Answer Review</h2>
          <p className="text-sm text-muted-foreground">
            Compare submitted answers with the expected answer.
          </p>
        </div>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="correct">Correct</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="incorrect">Incorrect</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {filteredAnswers.map((answer, index) => {
          const originalIndex = answerIndexById.get(answer.questionId) ?? index
          const missed = isMissed(answer)
          const statusLabel = missed ? "missed" : answer.status

          return (
            <AccordionItem
              key={answer.questionId}
              value={`item-${originalIndex}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-left">
                  {answer.status === "correct" ? (
                    <CheckCircle2
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-success"
                    />
                  ) : missed ? (
                    <Minus
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                    />
                  ) : (
                    <XCircle
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-destructive"
                    />
                  )}
                  <span className="font-heading text-sm font-medium">
                    Question {originalIndex + 1}
                  </span>
                  <Badge
                    variant={getStatusVariant(answer.status, missed)}
                    className="capitalize"
                  >
                    {statusLabel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(answer.score * 100)}%
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 pl-0 text-sm leading-6 sm:pl-6">
                  <div>
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span className="text-muted-foreground">
                      <MathText text={answer.userAnswer || "Not answered"} />
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Expected:</span>{" "}
                    <span className="text-muted-foreground">
                      <MathText text={answer.correctAnswer} />
                    </span>
                  </div>
                  <div className="border-l-2 border-primary/30 pl-3 text-muted-foreground">
                    <MathText text={answer.feedback} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
