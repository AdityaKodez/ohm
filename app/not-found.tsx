import { HomeIcon, SearchXIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-72"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, var(--primary), transparent 82%) 0%, color-mix(in oklch, var(--primary), transparent 94%) 48%, transparent 100%)",
        }}
      />
      <Empty className="z-10 max-w-lg rounded-none border-0 p-0">
        <EmptyHeader>
          <EmptyMedia
            className="bg-primary/10 text-primary"
            variant="icon"
          >
            <SearchXIcon />
          </EmptyMedia>
          <p className="font-display text-xl tracking-tight text-foreground/80 italic">
            Ohm
          </p>
          <EmptyTitle className="text-2xl sm:text-3xl">
            This page skipped class
          </EmptyTitle>
          <EmptyDescription>
            We checked under the desk, inside the quiz basket, and behind the
            answer key. This route is still absent.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg">
            <Link href="/">
              <HomeIcon data-icon="inline-start" />
              Back to Ohm
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
