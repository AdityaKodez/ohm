export function InsightNotes({
  title,
  description,
  icon,
  items,
  emptyMessage = "Nothing to highlight from this attempt.",
}: {
  title: string
  description: string
  icon: React.ReactNode
  items: string[]
  emptyMessage?: string
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
          {icon}
        </span>
        <div className="flex flex-col">
          <h2 className="font-heading text-base font-medium">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed px-3 py-2 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="rounded-lg bg-muted/50 px-3 py-2 text-sm leading-6 text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
