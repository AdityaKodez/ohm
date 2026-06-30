"use client"

import { useEffect, useState } from "react"

import { type Quiz } from "@/lib/quiz-schema"
import { loadQuiz } from "@/lib/quiz-storage"

/**
 * Polls session storage for a quiz that is being generated, surfacing any
 * generation error stashed by the creator flow. Returns the loaded quiz, the
 * loading state, and an error message if generation failed or timed out.
 */
export function useQuizLoader(id: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkError = sessionStorage.getItem(`quiz-error-${id}`)
    if (checkError) {
      sessionStorage.removeItem(`quiz-error-${id}`)
      setError(checkError)
      setLoading(false)
      return
    }

    const interval = setInterval(() => {
      const loaded = loadQuiz(id)
      if (loaded) {
        setQuiz(loaded)
        setLoading(false)
        clearInterval(interval)
      }
    }, 200)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (!loadQuiz(id)) {
        setError("Quiz generation timed out. Please go back and try again.")
        setLoading(false)
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [id])

  return { quiz, loading, error }
}
