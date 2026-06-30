# Ohm — AI Quiz Generator

A Next.js app that generates multi-section quizzes on any topic (or from a PDF) using Google Gemini, then grades short-answer and fill-in-the-blank responses with a second AI call.

---

## What it does

1. **Home** — user types a topic or attaches a PDF and hits send.
2. **Quiz room** — the app calls `/api/generate-quiz`, saves the result in `sessionStorage`, then navigates to `/quiz/[id]` where the user answers questions.
3. **Stats** — on submit, `/api/evaluate-quiz` scores every answer with Gemini; results land at `/stats/[id]`.

---

## Routes

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Home — quiz creation form |
| `/quiz/[id]` | `app/quiz/[id]/page.tsx` | Active quiz, polls `sessionStorage` until quiz data is ready |
| `/stats/[id]` | `app/stats/[id]/page.tsx` | Score breakdown, section charts, answer review |
| `POST /api/generate-quiz` | `app/api/generate-quiz/route.ts` | Validates input → extracts PDF text → calls Gemini |
| `POST /api/evaluate-quiz` | `app/api/evaluate-quiz/route.ts` | Scores submitted answers with Gemini |

---

## Question types

Defined in `lib/quiz-schema.ts` (Zod). Four sections:

- **MCQ** — four options, one correct answer.
- **Fill in the blank** — a single correct answer string.
- **Assertion–Reason** — two statements, four pre-written options.
- **Short answer** — AI-graded against a sample answer and key points.

---

## Key files

```
app/
  layout.tsx              — fonts (Inter, DM Sans, Playfair Display), ThemeProvider
  page.tsx                — entry; mounts ModeToggle + QuizCreator
  quiz/[id]/quiz-room.tsx — question panel + sidebar navigation
  stats/[id]/stats-dashboard.tsx — score header, charts, answer review

components/
  home/quiz-creator.tsx   — main form: topic input, PDF attach, difficulty/count selectors
  mode-toggle.tsx         — light/dark button, animated with motion/react
  theme-provider.tsx      — next-themes wrapper; also registers 'D' hotkey to toggle theme

lib/
  gemini-ai.ts            — Gemini API calls via @ai-sdk/google
  quiz-schema.ts          — Zod schemas + TypeScript types for the entire data model
  quiz-storage.ts         — sessionStorage helpers (saveQuiz, loadQuiz, saveResult, etc.)
  pdf.ts                  — pdf-parse wrapper; extracts and validates text from uploaded PDFs
  quiz-prompts.ts         — prompt templates sent to Gemini
```

---

## Data flow

```
QuizCreator
  └─ POST /api/generate-quiz
       ├─ topic → Gemini prompt
       └─ PDF   → pdf-parse → text → Gemini prompt
            └─ Quiz JSON (validated by Zod)
                 └─ saveQuiz(id) → sessionStorage
                      └─ /quiz/[id] polls sessionStorage → renders questions
                           └─ POST /api/evaluate-quiz
                                └─ QuizResult → saveResult(id) → /stats/[id]
```

---

## Storage

All quiz data lives in `sessionStorage` — no database. Clearing the tab/session loses everything. The `id` is a `crypto.randomUUID()` generated client-side before navigation so the URL and storage key always match.

---

## Theme

`next-themes` manages light/dark mode via a `class` attribute on `<html>`. Press `D` anywhere (outside an input) to toggle. The `ModeToggle` button in the top-right of the home page does the same with an animated icon swap.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| AI | Google Gemini via `@ai-sdk/google` + `ai` |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui + Radix UI |
| Animation | motion/react |
| Math rendering | react-katex + KaTeX |
| Charts | Recharts |
| Validation | Zod v4 |
| Theme | next-themes |

---

## Environment variables

| Variable | Description |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio API key for Gemini |

---

## Getting started

```bash
pnpm install
# add GOOGLE_GENERATIVE_AI_API_KEY to .env.local
pnpm dev
```
