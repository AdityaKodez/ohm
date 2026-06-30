import { extractText, getDocumentProxy } from "unpdf"

/** Maximum characters to send to the AI model from extracted PDF text. */
const MAX_TEXT_LENGTH = 20_000

/** Minimum meaningful text length to consider a PDF as having extractable content. */
const MIN_TEXT_LENGTH = 50

/**
 * Extracts text content from a PDF buffer using unpdf (serverless-safe).
 *
 * unpdf ships its own serverless build of PDF.js — no DOMMatrix or other
 * browser globals required, making it safe on Vercel's Node.js runtime.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })

  const cleaned = text
    .replace(/\r\n/g, "\n")       // Normalise line endings
    .replace(/[ \t]+/g, " ")      // Collapse horizontal whitespace
    .replace(/\n{3,}/g, "\n\n")   // Max two consecutive newlines
    .trim()

  return cleaned.length > MAX_TEXT_LENGTH
    ? cleaned.slice(0, MAX_TEXT_LENGTH)
    : cleaned
}

/**
 * Validates that extracted PDF text contains meaningful, readable content.
 * Returns an error reason if the text is unusable.
 */
export function validatePdfContent(text: string): {
  valid: boolean
  reason?: string
} {
  if (text.length < MIN_TEXT_LENGTH) {
    return {
      valid: false,
      reason:
        "This PDF does not contain enough extractable text. It may be a scanned document or image-only PDF. Please upload a PDF with selectable text.",
    }
  }

  const alphaChars = text.replace(/[^a-zA-Z]/g, "").length
  const alphaRatio = alphaChars / text.length

  if (alphaRatio < 0.3) {
    return {
      valid: false,
      reason:
        "The PDF text appears to be mostly non-readable content (symbols, numbers, or structural data). Please upload a PDF with readable study material.",
    }
  }

  return { valid: true }
}
