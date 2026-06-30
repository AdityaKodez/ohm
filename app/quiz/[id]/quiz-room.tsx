"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { QuestionPanel } from "@/components/quiz/question-panel"
import { QuizError } from "@/components/quiz/quiz-error"
import { QuizLoading } from "@/components/quiz/quiz-loading"
import { QuizSidebar } from "@/components/quiz/quiz-sidebar"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useQuizLoader } from "@/hooks/use-quiz-loader"
import { type QuizResult, type UserAnswers } from "@/lib/quiz-schema"
import { markQuizSubmitted, saveResult } from "@/lib/quiz-storage"

export function QuizRoom({ id }: { id: string }) {
  const router = useRouter()
  const { quiz, loading, error: loadError } = useQuizLoader(id)
  const [answers, setAnswers] = useState<UserAnswers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  const error = loadError || submitError

    useEffect(() => {
    if (!loading && quiz?.isSubmitted) {
      router.push(`/stats/${id}`)
    }
  }, [loading, quiz, router, id])
  const answeredCount = useMemo(() => {
    if (!quiz) return 0
    return quiz.questions.filter((question) => answers[question.id]?.trim()).length
  }, [answers, quiz])

  const progress = quiz ? Math.round((answeredCount / quiz.questions.length) * 100) : 0
  const currentQuestion = quiz?.questions[currentIndex]

  function setAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  function goToQuestion(index: number) {
    if (quiz && index >= 0 && index < quiz.questions.length) {
      setCurrentIndex(index)
    }
  }

  async function submitQuiz() {
    if (!quiz || submitting) return

    setSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/evaluate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz, answers }),
      })

      const data = (await response.json()) as { result?: QuizResult; error?: string }

      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "Evaluation failed.")
      }

saveResult(data.result)
markQuizSubmitted(quiz.id)
router.push(`/stats/${quiz.id}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Evaluation failed.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return <QuizLoading />
  }

  if (error || !quiz) {
    return <QuizError error={error} />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <main className="relative flex-1 overflow-y-auto">
          <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur md:hidden">
            <Button variant="ghost" asChild className="h-9 px-2 text-sm">
              <Link href="/"><ArrowLeft className="size-4" /> Back</Link>
            </Button>
            <SidebarTrigger className="size-9 rounded-full border border-border bg-background shadow-sm" />
          </nav>

          <div className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:px-6 md:p-8">
            {currentQuestion && (
              <QuestionPanel
                question={currentQuestion}
                index={currentIndex}
                total={quiz.questions.length}
                answers={answers}
                onAnswer={setAnswer}
                onNavigate={goToQuestion}
              />
            )}
          </div>
        </main>

        <QuizSidebar
          quiz={quiz}
          answers={answers}
          answeredCount={answeredCount}
          progress={progress}
          currentIndex={currentIndex}
          onNavigate={goToQuestion}
          onSubmit={submitQuiz}
          submitting={submitting}
          error={error}
        />
      </div>
    </SidebarProvider>
  )
}
