export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">{children}</div>
    </main>
  )
}
