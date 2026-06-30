export function EmptyChartMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-37.5 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
      {children}
    </div>
  )
}
