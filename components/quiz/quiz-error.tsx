"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function QuizError({ error }: { error: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="mx-auto max-w-xl text-center">
        <CardContent className="space-y-4 py-10">
          <div className="font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl">{error ? "Generation failed" : "Quiz session expired"}</div>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-balance text-muted-foreground">{error || "Quizzes are stored in your current browser session. Generate a new quiz to continue."}</p>
          <Button asChild><Link href="/">Create a new quiz</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}
