import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { evaluateQuiz } from "@/lib/gemini-ai"
import { evaluateQuizRequestSchema } from "@/lib/quiz-schema"
import { enforceRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const rateLimited = await enforceRateLimit(request)
  if (rateLimited) return rateLimited

  try {
    const body = await request.json()
    const { quiz, answers } = evaluateQuizRequestSchema.parse(body)
    const result = await evaluateQuiz(quiz, answers)

    return NextResponse.json({ result })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "The quiz submission was not valid. Please retry." },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : "Unable to evaluate quiz."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
