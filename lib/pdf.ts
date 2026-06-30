import { PDFParse } from "pdf-parse"

/** Maximum characters to send to the AI model from extracted PDF text. */
const MAX_TEXT_LENGTH = 20_000

/** Minimum meaningful text length to consider a PDF as having extractable content. */
const MIN_TEXT_LENGTH = 50

/**
 * Extracts text content from a PDF buffer using pdf-parse.
 *
 * This performs real PDF parsing — decoding content streams, handling
 * multi-page documents, and preserving paragraph structure — unlike
 * the previous implementation which read raw bytes and produced garbage.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const result = await parser.getText()

  // Clean up and destroy the parser to free resources
  await parser.destroy()

  const text = result.text
    .replace(/\r\n/g, "\n")          // Normalise line endings
    .replace(/[ \t]+/g, " ")         // Collapse horizontal whitespace
    .replace(/\n{3,}/g, "\n\n")      // Max two consecutive newlines
    .trim()

  if (text.length > MAX_TEXT_LENGTH) {
    return text.slice(0, MAX_TEXT_LENGTH)
  }

  return text
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

  // Check if the text is mostly PDF structural tokens rather than real words.
  // Real document text will have a high ratio of alphabetic characters.
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
