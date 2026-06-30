"use client"

import "katex/dist/katex.min.css"

import { BlockMath, InlineMath } from "react-katex"

/**
 * Regex that splits a string on $$...$$ (block math) and $...$ (inline math).
 * Block delimiters are matched first so `$$` isn't consumed as two inline `$`.
 */
const MATH_REGEX = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g

/**
 * Detects raw LaTeX that the model forgot to wrap in `$...$`.
 * Matches common LaTeX commands (\frac, \sin, \sqrt, etc.) and
 * math operators.
 *
 * Subscript/superscript (`_`, `^`) only count when they are a *lone*
 * operator (e.g. `x_2`, `a^n`) — a run like `______` is a fill-in-the-blank
 * marker, not LaTeX, so it must not trigger math rendering (KaTeX would
 * render it as a red parse error).
 */
const RAW_LATEX_REGEX = /\\(?:frac|sqrt|sin|cos|tan|log|ln|lim|sum|prod|int|infty|alpha|beta|gamma|delta|theta|pi|sigma|omega|pm|mp|times|div|cdot|leq|geq|neq|approx|equiv|rightarrow|leftarrow|text|mathrm|mathbf)|(?<![_^])[_^](?![_^])/

/**
 * Renders a string that may contain LaTeX math delimiters.
 *
 * - `$$...$$` → KaTeX block equation
 * - `$...$`  → KaTeX inline equation
 * - Raw LaTeX (no delimiters but contains \commands or ^_) → KaTeX inline
 * - Everything else → plain text
 *
 * Falls back to raw text if KaTeX fails to parse a segment.
 */
export function MathText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  if (!text) return null

  // If there are no $ delimiters but the text contains raw LaTeX, render as inline math
  const hasDelimiters = text.includes("$")
  if (!hasDelimiters && RAW_LATEX_REGEX.test(text)) {
    try {
      return (
        <span className={className}>
          <InlineMath math={text} />
        </span>
      )
    } catch {
      return <span className={className}>{text}</span>
    }
  }

  const segments = text.split(MATH_REGEX)

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        if (segment.startsWith("$$") && segment.endsWith("$$")) {
          const latex = segment.slice(2, -2).trim()
          try {
            return <BlockMath key={i} math={latex} />
          } catch {
            return <span key={i}>{segment}</span>
          }
        }

        if (segment.startsWith("$") && segment.endsWith("$")) {
          const latex = segment.slice(1, -1).trim()
          try {
            return <InlineMath key={i} math={latex} />
          } catch {
            return <span key={i}>{segment}</span>
          }
        }

        // Plain text segment — check if it sneaks in raw LaTeX
        if (RAW_LATEX_REGEX.test(segment)) {
          try {
            return <InlineMath key={i} math={segment} />
          } catch {
            return <span key={i}>{segment}</span>
          }
        }

        return <span key={i}>{segment}</span>
      })}
    </span>
  )
}
