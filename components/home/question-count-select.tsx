"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function QuestionCountSelect({
  value,
  onValueChange,
  disabled,
}: {
  value: number
  onValueChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(next) => onValueChange(Number(next))}
      disabled={disabled}
    >
      <SelectTrigger className="h-9 rounded-full bg-muted/50 text-xs">
       <SelectValue placeholder="Count" />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 15, 20].map((count) => (
          <SelectItem key={count} value={count.toString()}>
            {count}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
