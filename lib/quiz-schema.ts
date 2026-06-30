import { z } from "zod"

export const difficultySchema = z.enum(["easy", "balanced", "challenging"])

export const sectionSchema = z.enum([
  "mcq",
  "fill-blank",
  "assertion-reason",
  "short-answer",
])

const baseQuestionSchema = z.object({
  id: z.string().min(1),
  section: sectionSchema,
  prompt: z.string().min(10),
  concept: z.string().min(2),
  explanation: z.string().min(20),
})

export const mcqQuestionSchema = baseQuestionSchema.extend({
  section: z.literal("mcq"),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
})

export const fillBlankQuestionSchema = baseQuestionSchema.extend({
  section: z.literal("fill-blank"),
  correctAnswer: z.string().min(1),
})

export const assertionReasonQuestionSchema = baseQuestionSchema.extend({
  section: z.literal("assertion-reason"),
  assertion: z.string().min(10),
  reason: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
})

export const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  section: z.literal("short-answer"),
  sampleAnswer: z.string().min(20),
  keyPoints: z.array(z.string().min(2)).min(2).max(5),
})

export const quizQuestionSchema = z.discriminatedUnion("section", [
  mcqQuestionSchema,
  fillBlankQuestionSchema,
  assertionReasonQuestionSchema,
  shortAnswerQuestionSchema,
])

export const quizSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(4),
  sourceSummary: z.string().min(30),
  difficulty: difficultySchema,
  estimatedMinutes: z.number().int().min(3).max(45),
  isSubmitted: z.boolean().default(false),
  questions: z.array(quizQuestionSchema).min(4).max(24),
})

export const generateQuizRequestSchema = z.object({
  sourceType: z.enum(["topic", "pdf"]),
  topic: z.string().trim().max(160).optional(),
  content: z.string().trim().max(30000).optional(),
  pdfBase64: z.string().max(15_000_000).optional(), // ~10MB PDF as base64
  difficulty: difficultySchema,
  questionCount: z.number().int().min(4).max(20),
})

export const userAnswersSchema = z.record(z.string(), z.string())

export const evaluatedAnswerSchema = z.object({
  questionId: z.string().min(1),
  section: sectionSchema,
  status: z.enum(["correct", "partial", "incorrect"]),
  score: z.number().min(0).max(1),
  userAnswer: z.string(),
  correctAnswer: z.string().min(1),
  feedback: z.string().min(8),
})

export const sectionPerformanceSchema = z.object({
  section: sectionSchema,
  label: z.string().min(2),
  score: z.number().min(0).max(100),
  correct: z.number().int().min(0),
  total: z.number().int().min(0),
})

export const quizResultSchema = z.object({
  quizId: z.string().min(1),
  score: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  correctCount: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  sectionPerformance: z.array(sectionPerformanceSchema).min(1),
  evaluatedAnswers: z.array(evaluatedAnswerSchema).min(1),
  strengths: z.array(z.string().min(4)).min(1).max(5),
  weakAreas: z.array(z.string().min(4)).min(1).max(5),
  suggestions: z.array(z.string().min(8)).min(1).max(5),
  summaryFeedback: z.string().min(30),
})

export const evaluateQuizRequestSchema = z.object({
  quiz: quizSchema,
  answers: userAnswersSchema,
})

export type Difficulty = z.infer<typeof difficultySchema>
export type QuizSection = z.infer<typeof sectionSchema>
export type QuizQuestion = z.infer<typeof quizQuestionSchema>
export type Quiz = z.infer<typeof quizSchema>
export type GenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>
export type UserAnswers = z.infer<typeof userAnswersSchema>
export type QuizResult = z.infer<typeof quizResultSchema>
