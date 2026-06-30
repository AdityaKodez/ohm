import { type Quiz, type QuizResult } from "@/lib/quiz-schema"


const quizKey = (id: string) => `quiz:${id}`
const resultKey = (id: string) => `result:${id}`

export function saveQuiz(quiz: Quiz) {
  sessionStorage.setItem(quizKey(quiz.id), JSON.stringify(quiz))
}

export function loadQuiz(id: string) {
  const stored = sessionStorage.getItem(quizKey(id))
  return stored ? (JSON.parse(stored) as Quiz) : null
}

export function saveResult(result: QuizResult) {
  sessionStorage.setItem(resultKey(result.quizId), JSON.stringify(result) )
}

export function loadResult(id: string) {
  const stored = sessionStorage.getItem(resultKey(id))
  return stored ? (JSON.parse(stored) as QuizResult) : null
}

export function markQuizSubmitted(id: string) {
  const stored = loadQuiz(id)
  if (stored) {
    stored.isSubmitted = true
    sessionStorage.setItem(quizKey(id), JSON.stringify(stored))
  }
}
