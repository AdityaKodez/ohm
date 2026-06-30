"use client"

import { ArrowLeft, BookOpen, ListChecks, Loader2, Send, TrendingUp } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { type Quiz, type UserAnswers } from "@/lib/quiz-schema"
import { cn } from "@/lib/utils"

export function QuizSidebar({
  quiz,
  answers,
  answeredCount,
  progress,
  currentIndex,
  onNavigate,
  onSubmit,
  submitting,
  error,
}: {
  quiz: Quiz
  answers: UserAnswers
  answeredCount: number
  progress: number
  currentIndex: number
  onNavigate: (index: number) => void
  onSubmit: () => void
  submitting: boolean
  error: string
}) {
  return (
<Sidebar side="right">
  <SidebarContent className="gap-0">
    <div className="border-b p-2">
      <Button variant="ghost" asChild size="lg">
        <Link href="/"><ArrowLeft className="mr-2 size-4" /> Back</Link>
      </Button>
    </div>

    <div className="flex-1 space-y-4 p-2">
      <SidebarGroup>
        <SidebarGroupContent>
          <h1 className="text-lg font-semibold font-heading tracking-tight text-balance leading-snug">{quiz.title}</h1>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="gap-2">
          <TrendingUp className="size-4" />
          Progress
        </SidebarGroupLabel>
        <SidebarGroupContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{answeredCount}/{quiz.questions.length}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="gap-2">
          <ListChecks className="size-4" />
          Questions
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => onNavigate(idx)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                  idx === currentIndex && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  answers[q.id]?.trim()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="gap-2">
          <BookOpen className="size-4" />
          Source
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <p className="text-xs leading-relaxed text-muted-foreground">{quiz.sourceSummary}</p>
        </SidebarGroupContent>
      </SidebarGroup>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>

    <div className="border-t p-4">
      <Button
        className="h-11 w-full"
        disabled={submitting || answeredCount === 0}
        onClick={onSubmit}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Submit Quiz
          </>
        )}
      </Button>
    </div>
  </SidebarContent>
</Sidebar>
  )
}
