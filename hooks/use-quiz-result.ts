"use client"

import { useEffect, useState } from "react"

import { type Quiz, type QuizResult } from "@/lib/quiz-schema"
import { loadQuiz, loadResult } from "@/lib/quiz-storage"

/**
 * Loads a submitted quiz result (and its quiz) from session storage on mount,
 * surfacing a read error if the stored data cannot be parsed.
 */
export function useQuizResult(id: string) {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setResult(loadResult(id))
        setQuiz(loadQuiz(id))
      } catch {
        setLoadError(
          "Saved stats could not be read. Generate and submit the quiz again."
        )
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [id])

  return { result, quiz, loadError }
}
