import { google } from "@ai-sdk/google"
import { generateText, NoObjectGeneratedError, Output } from "ai"

import {
  type GenerateQuizRequest,
  type Quiz,
  type QuizResult,
  type UserAnswers,
  quizResultSchema,
  quizSchema,
} from "@/lib/quiz-schema"
import {
  buildEvaluatePrompt,
  buildGeneratePrompt,
  formatSource,
} from "@/lib/quiz-prompts"

const model = google(process.env.GOOGLE_MODEL ?? "gemini-2.0-flash-exp")

function assertApiKey() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to your environment to generate real quizzes.")
  }
}

function isProviderSchemaError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  return (
    error.message.includes("Generated JSON does not match the expected schema") ||
    error.message.includes("json_validate_failed")
  )
}

export async function generateQuiz(request: GenerateQuizRequest): Promise<Quiz> {
  assertApiKey()

  const id = crypto.randomUUID()
  const source = formatSource(request)

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ name: "quiz", schema: quizSchema }),
      temperature: 0.5,
      prompt: buildGeneratePrompt({ id, request, source }),
    })

    return { ...output, id, difficulty: request.difficulty }
  } catch (error) {
    console.error("Error generating quiz:", error)

    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error("AI returned an invalid quiz. Please retry with a clearer topic or shorter PDF text.")
    }

    if (isProviderSchemaError(error)) {
      throw new Error("AI could not produce valid quiz JSON. Please retry with fewer questions or a shorter source.")
    }

    throw error
  }
}

export async function evaluateQuiz(
  quiz: Quiz,
  answers: UserAnswers
): Promise<QuizResult> {
  assertApiKey()

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ name: "quizResult", schema: quizResultSchema }),
      temperature: 0.2,
      prompt: buildEvaluatePrompt(quiz, answers),
    })

    return {
      ...output,
      quizId: quiz.id,
      totalQuestions: quiz.questions.length,
    }
  } catch (error) {
    console.error("Error evaluating quiz:", error)

    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error("AI returned an invalid evaluation. Please retry submission.")
    }

    if (isProviderSchemaError(error)) {
      throw new Error("AI could not produce valid evaluation JSON. Please retry submission.")
    }

    throw error
  }
}
