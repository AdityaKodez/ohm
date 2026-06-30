"use client"

import { AlertTriangleIcon } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Empty className="max-w-lg rounded-none border-0 p-0">
        <EmptyHeader>
          <EmptyMedia
            className="bg-destructive/10 text-destructive"
            variant="icon"
          >
            <AlertTriangleIcon />
          </EmptyMedia>
          <p className="font-display text-xl tracking-tight text-foreground/80 italic">
            Ohm
          </p>
          <EmptyTitle className="text-2xl sm:text-3xl">
            Something went wrong
          </EmptyTitle>
          <EmptyDescription>
            Ohm could not finish loading this screen. Try again to refresh the
            route.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => unstable_retry()}>Try again</Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
