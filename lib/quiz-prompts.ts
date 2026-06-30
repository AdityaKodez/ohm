import {
  type Difficulty,
  type GenerateQuizRequest,
  type Quiz,
  type UserAnswers,
} from "@/lib/quiz-schema"

export function formatSource(request: GenerateQuizRequest) {
  if (request.sourceType === "topic") {
    return `Topic: ${request.topic}`
  }

  return `The following is text extracted from a PDF document uploaded by the student.
Base ALL questions strictly on this content. Do NOT use any outside knowledge.
If you cannot generate questions from the text, state that the content is insufficient.

--- START OF DOCUMENT ---
${request.content}
--- END OF DOCUMENT ---`
}

function getDifficultyInstructions(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return `
Difficulty: Easy
- Ask straightforward recall and comprehension questions.
- Use simple, clear language with no tricks or edge cases.
- MCQ distractors should be obviously wrong to someone who studied the material.
- Fill-in-the-blank answers should be single common terms directly stated in the source.
- Short-answer questions should require 1-2 sentence responses covering a single concept.
- Assertion-reason questions should have clear, unambiguous relationships.`

    case "balanced":
      return `
Difficulty: Balanced (Intermediate)
- Mix recall questions with some application and light analysis.
- MCQ distractors should be plausible but distinguishable with solid understanding.
- Include questions that require connecting two related concepts.
- Fill-in-the-blank may require understanding context, not just keyword memorization.
- Short-answer questions should require explaining "why" or "how", not just "what".
- Assertion-reason questions should require understanding causal relationships.`

    case "challenging":
      return `
Difficulty: Challenging (Advanced) — THIS IS THE HARDEST MODE. Questions must be genuinely difficult.

MANDATORY requirements for Challenging mode:
- Target Bloom's Taxonomy levels: Analyze, Evaluate, and Create. Do NOT ask simple recall or comprehension questions.
- Every question must require multi-step reasoning, critical thinking, or application to novel scenarios.
- Questions should test deep understanding, not surface-level memorization.

MCQ requirements for Challenging:
- All 4 options must be highly plausible and closely related. A student who only partially understands should struggle.
- Use common misconceptions, subtle distinctions, and edge cases as distractors.
- At least some MCQs should present a scenario or problem to solve, not just "Which of the following is true?"
- Include questions that require combining multiple concepts or applying knowledge to unfamiliar situations.

Fill-in-the-blank requirements for Challenging:
- Answers should require precise technical terminology or specific values that demand thorough understanding.
- The surrounding context should not make the answer trivially obvious. Require inference or synthesis.

Assertion-reason requirements for Challenging:
- Both assertion and reason should be independently plausible statements.
- Include cases where both are true but the reason does NOT correctly explain the assertion.
- Include cases where the assertion is true but the reason is false, or vice versa.
- The relationships should require careful logical analysis to evaluate.

Short-answer requirements for Challenging:
- Require multi-paragraph responses that demonstrate synthesis across multiple concepts.
- Ask students to compare/contrast, evaluate trade-offs, predict outcomes, or propose solutions.
- Key points should cover nuanced aspects that only a deep understanding would reveal.
- Include "what if" scenarios, counterexamples, or limitation analysis.

General Challenging guidelines:
- Frame questions around real-world applications, edge cases, exceptions to rules, or interdisciplinary connections.
- Avoid questions answerable by simple keyword matching from the source text.
- Explanations should reveal the depth of reasoning required.
- If the source is a broad topic, zoom into the most complex and nuanced sub-areas.`
  }
}

export function buildGeneratePrompt({
  id,
  request,
  source,
}: {
  id: string
  request: GenerateQuizRequest
  source: string
}) {
  const difficultyBlock = getDifficultyInstructions(request.difficulty)

  return `
Create a classroom quiz for a school exhibition AI demo.

Use this quiz id: ${id}.
Total questions: ${request.questionCount}

${difficultyBlock}

Question types (section field) with REQUIRED fields:
1. "mcq": id, section, prompt, concept, explanation, options (array of exactly 4 strings), correctAnswer (must match one option exactly)
2. "fill-blank": id, section, prompt, concept, explanation, correctAnswer
3. "assertion-reason": id, section, prompt, concept, explanation, assertion, reason, options (array of exactly 4 strings), correctAnswer (must match one option exactly)
4. "short-answer": id, section, prompt, concept, explanation, sampleAnswer, keyPoints (array of 2-5 strings)

Requirements:
- When questions involve mathematical equations, formulas, chemical equations, or scientific notation,
  use LaTeX notation wrapped in $...$ for inline math and $$...$$ for display/block math.
  This applies to ALL fields: prompt, options, assertion, reason, correctAnswer, explanation, sampleAnswer, and keyPoints.
  Examples: $E = mc^2$, $\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, $$\\int_0^\\infty e^{-x} dx = 1$$
- Use LaTeX for ALL math expressions — never write bare LaTeX commands without $...$ delimiters.
- Base every question only on the provided source.
- Include a balanced mix of all 4 question types.
- Keep questions clear and suitable for school students.
- correctAnswer must match one of the options exactly for mcq and assertion-reason.
- Explanations must be at least 20 characters.
- Generate a title (min 4 chars) and sourceSummary (min 30 chars).
- Set estimatedMinutes (3-45) based on question count.
- Avoid duplicate questions.

Source:
${source}
`
}

export function buildEvaluatePrompt(quiz: Quiz, answers: UserAnswers) {
  return `Evaluate this student's quiz attempt fairly.

Return only valid JSON for the requested quizResult object. Do not include markdown, prose, or JSON Schema metadata.

Rules:
- When feedback or correctAnswer involves math, use LaTeX notation: $...$ for inline, $$...$$ for block math.
- Use LaTeX for ALL math expressions in feedback — never write them as plain text.
- MCQ, fill blank, and assertion-reason questions should be either correct or incorrect unless wording deserves partial credit.
- Short answers may receive partial credit based on key points.
- Scores are percentages from 0 to 100 overall and per section.
- evaluatedAnswers score must be from 0 to 1 for each question.
- Include every question exactly once in evaluatedAnswers.
- Keep feedback encouraging and useful for a school exhibition.

Quiz JSON:\n${JSON.stringify(quiz)}

Student answers JSON:\n${JSON.stringify(answers)}`
}
