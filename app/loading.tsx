import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
        <Spinner />
        <span>
          Loading{" "}
          <span className="font-display text-foreground/80 italic">Ohm</span>…
        </span>
      </div>
    </main>
  )
}
