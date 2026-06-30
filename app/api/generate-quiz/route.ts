import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { generateQuiz } from "@/lib/gemini-ai"
import { extractPdfText, validatePdfContent } from "@/lib/pdf"
import { generateQuizRequestSchema } from "@/lib/quiz-schema"

/** 10 MB raw file size limit (base64 is ~33% larger than raw). */
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = generateQuizRequestSchema.parse(body)

    if (payload.sourceType === "topic" && !payload.topic) {
      return NextResponse.json(
        { error: "Enter a topic before generating a quiz." },
        { status: 400 }
      )
    }

    if (payload.sourceType === "pdf") {
      if (!payload.pdfBase64) {
        return NextResponse.json(
          { error: "Upload a PDF file before generating a quiz." },
          { status: 400 }
        )
      }

      // Decode base64 to Buffer
      const pdfBuffer = Buffer.from(payload.pdfBase64, "base64")

      if (pdfBuffer.length > MAX_PDF_SIZE_BYTES) {
        return NextResponse.json(
          { error: "PDF is too large. Please upload a file under 10 MB." },
          { status: 400 }
        )
      }

      // Extract real text from the PDF
      let extractedText: string
      try {
        extractedText = await extractPdfText(pdfBuffer)
      } catch {
        return NextResponse.json(
          {
            error:
              "Could not read this PDF. The file may be corrupted or password-protected. Please try a different PDF.",
          },
          { status: 400 }
        )
      }

      // Validate extracted text is meaningful
      const validation = validatePdfContent(extractedText)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.reason },
          { status: 400 }
        )
      }

      // Pass extracted text as content for quiz generation
      payload.content = extractedText
    }

    const quiz = await generateQuiz(payload)

    return NextResponse.json({ quiz })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "The quiz request was not valid. Please check the inputs." },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : "Unable to generate quiz."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
