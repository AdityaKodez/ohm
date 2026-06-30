"use client"

import { FileType, Loader2, Paperclip, Send, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"

import { CornerDoodles } from "@/components/home/corner-doodles"
import { DifficultySelect } from "@/components/home/difficulty-select"
import { Hero } from "@/components/home/hero"
import { PromptIdeas } from "@/components/home/prompt-ideas"
import { QuestionCountSelect } from "@/components/home/question-count-select"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { easeOut, openingContainer, openingItem } from "@/lib/home"

import { type Difficulty, type Quiz } from "@/lib/quiz-schema"
import { saveQuiz } from "@/lib/quiz-storage"

/** Human-readable file size, e.g. "842 KB" or "3.4 MB". */
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function QuizCreator() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [topic, setTopic] = useState("Photosynthesis")
  const [pdfBase64, setPdfBase64] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("balanced")
  const [questionCount, setQuestionCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")



  const hasPdf = pdfBase64.length > 0
  const [fileSizeError, setFileSizeError] = useState("")

  /** 5 MB client-side limit. */
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const canGenerate = useMemo(
    () => (topic.trim().length > 2 || hasPdf) && !fileSizeError,
    [hasPdf, topic, fileSizeError]
  )
  const shouldReduceMotion = useReducedMotion()

  async function handleFile(file: File | undefined) {
    if (!file) return

    setError("")
    setFileSizeError("")

    if (file.type !== "application/pdf") {
      removeFile()
      setError("Please upload a PDF file for the exhibition demo.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileName(file.name)
      setFileSize(formatBytes(file.size))
      setPdfBase64("")
      setFileSizeError(
        `File is too large (${formatBytes(file.size)}). Maximum allowed size is 5 MB.`
      )
      return
    }

    // Surface the card immediately in a "reading" state, then attach the
    // encoded payload once the base64 conversion completes.
    setFileName(file.name)
    setFileSize(formatBytes(file.size))
    setPdfBase64("")

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    setPdfBase64(btoa(binary))
  }

  function removeFile() {
    setPdfBase64("")
    setFileName("")
    setFileSize("")
    setFileSizeError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function generate() {
    if (!canGenerate || loading) return

    setLoading(true)
    setError("")

    const sourceMode = hasPdf ? "pdf" : "topic"
    // This is the quiz's permanent id: the URL we navigate to AND the key the
    // quiz page polls for. We deliberately keep a single id rather than swapping
    // in the server-generated one afterwards — that second navigation would be
    // fired from this already-unmounted component and the App Router drops it
    // unreliably, leaving the URL (and quiz.id) in an inconsistent state.
    const id = crypto.randomUUID()

    router.push(`/quiz/${id}`)

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: sourceMode,
          topic: sourceMode === "topic" ? topic.trim() : undefined,
          pdfBase64: sourceMode === "pdf" ? pdfBase64 : undefined,
          difficulty,
          questionCount,
        }),
      })

      const data = (await response.json()) as { quiz?: Quiz; error?: string }

      if (!response.ok || !data.quiz) {
        throw new Error(data.error ?? "Quiz generation failed.")
      }

      // Persist under the navigated id so the quiz-loader polling resolves it.
      saveQuiz({ ...data.quiz, id })
    } catch (error) {
      sessionStorage.setItem(
        `quiz-error-${id}`,
        error instanceof Error ? error.message : "Quiz generation failed."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: easeOut }}
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, var(--primary), transparent 82%) 0%, color-mix(in oklch, var(--primary), transparent 94%) 48%, transparent 100%)",
        }}
      />
      <CornerDoodles />
      <motion.section
        className="z-10 flex w-full max-w-3xl flex-col gap-5"
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={openingContainer}
      >
        <Hero />
        <motion.div className="space-y-3" variants={openingItem}>
          <AnimatePresence initial={false}>
            {fileName && (
              <motion.div
                key="file-card"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8, scale: 0.985 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8, scale: 0.985 }
                }
                transition={{ duration: 0.22, ease: easeOut }}
                className="grid grid-cols-1 sm:grid-cols-3"
              >
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card/10 p-1.5 font-heading hover:bg-card/80">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground/5 text-foreground/70 ring-1 ring-inset ring-border">
                    {hasPdf ? (
                      <FileType className="size-4" />
                    ) : (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {fileName}
                    </span>
                    <span className="text-[8px] text-muted-foreground">
                      {hasPdf ? fileSize : "Reading…"}
                    </span>
                  </div>

                  <Button
                    aria-label={`Remove ${fileName}`}
                    size="icon-xs"
                    variant="outline"
                    className="rounded-full"
                    disabled={loading}
                    onClick={removeFile}
                    type="button"
                  >
                    <X className="size-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <InputGroup className="min-h-28 rounded-xl border border-foreground/10 bg-background/90 shadow-sm backdrop-blur-xl has-[>[data-align=block-end]]:[&>textarea]:pb-1">
            <InputGroupTextarea
              className="min-h-18 px-5 pt-5 text-[15px] leading-7 placeholder:text-muted-foreground/70"
              disabled={loading}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Ask for a quiz on any topic..."
            />

            <InputGroupAddon
              align="block-end"
              className="flex gap-2 px-4 pb-4 sm:gap-3"
            >
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="application/pdf"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />

              <InputGroupButton
                aria-label="Attach PDF"
                className="size-9 rounded-full border border-border bg-background"
                disabled={loading}
                size="icon-sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-4" />
              </InputGroupButton>

              {!fileName && (
                <InputGroupText className="hidden text-xs sm:flex">
                  Attach PDF or use the prompt
                </InputGroupText>
              )}

              <div className="flex w-full items-center justify-end gap-2 sm:ml-auto sm:w-auto">
                <DifficultySelect
                  value={difficulty}
                  onValueChange={setDifficulty}
                  disabled={loading}
                />
                <QuestionCountSelect
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  disabled={loading}
                />

                <Button
                  className="size-9 rounded-full"
                  disabled={!canGenerate || loading}
                  onClick={generate}
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            </InputGroupAddon>
          </InputGroup>

          {fileSizeError && (
            <div className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">
              {fileSizeError}
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </motion.div>
        <PromptIdeas onSelect={setTopic} />
      </motion.section>
    </main>
  )
}
