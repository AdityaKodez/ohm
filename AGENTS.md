<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ohm Project Rules & Conventions

Welcome to the **Ohm** project, a web application designed for students to generate and take interactive quizzes powered by Gemini (Google Generative AI).

Below is the developer/agent reference manual to ensure code style, architecture, and technology paradigms remain consistent.

---

## 1. Project Overview & Architecture
* **Purpose:** A local-first, server-less interactive classroom quiz app.
* **Technology Stack:**
  * **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
  * **AI Integration:** Vercel AI SDK (`ai` version 7) and `@ai-sdk/google`.
  * **PDF Processing:** Client-side upload converted to base64, then parsed on the server side using `pdf-parse`.
  * **Math rendering:** KaTeX and `react-katex` for formula rendering.
  * **Charts:** Recharts for summary analytics.
  * **Animations:** Framer Motion (`motion`).
  * **Styling:** Tailwind CSS v4 + Shadcn UI components.
  * **State/Database:** **NO DATABASE OR PRISMA**. All generated quizzes and evaluation results are persisted on the client-side in the browser's `sessionStorage`.

---

## 2. Coding Guidelines & Standards

### A. Next.js & React 19 Practices
* **App Router Navigation:** Page parameters are asynchronous. Route page entrypoints must treat `params` as a promise (e.g. `params: Promise<{ id: string }>`) and await them before accessing keys.
* **Client Components:** Use `"use client"` at the top of client-side interactive files. Keep routing clean.
* **Component Splitting:** Keep page layouts clean; delegate complex pages to container components (like `QuizRoom` under `/quiz/[id]/quiz-room.tsx`).

### B. Math, Science & LaTeX Rendering
* **Strict Rule:** Any math symbols, formulas, equations, or scientific notation must be written in standard LaTeX.
* **Delimiters:**
  * **Inline math:** Wrapped in single dollar signs: `$formula$` (e.g. `$E = mc^2$`).
  * **Block/Display math:** Wrapped in double dollar signs: `$$formula$$`.
* **Renderer Component:** Always use `<MathText />` (defined in `components/ui/math-text.tsx`) to render text containing mathematical formulas. It parses both inline and display math block delimiters and falls back safely to plain text on parser failure.

### C. AI Generation & Evaluation
* **AI Model Selection:** Always use `google(process.env.GOOGLE_MODEL ?? "gemini-2.0-flash-exp")` as the model wrapper.
* **API Route Limits:** For PDF processing, base64 data must be parsed, validated, and sliced to a maximum of `MAX_TEXT_LENGTH = 20_000` characters to optimize prompt size.
* **Structured JSON Output:** Use `Output.object` (from Vercel AI SDK) with a corresponding Zod schema (`quizSchema` or `quizResultSchema` defined in `lib/quiz-schema.ts`) to ensure response parsing safety. Do not implement custom prompt parsing regex for JSON parsing.
* **Challenging Difficulty Mode:** For `"challenging"` difficulty, instruct the model to output multi-step reasoning questions mapping to Bloom's Higher-Level thinking (Analyze, Evaluate, Create). Avoid trivial recall/comprehension questions.

### D. Styling & Design System
* **Tailwind CSS v4:** We use `@import "tailwindcss";` in `globals.css` with Tailwind v4. Do not use legacy Tailwind v3 syntax/configurations.
* **Color Palette:** Curated HSL/OKLCH color palettes defined in `globals.css`. Ensure new elements leverage the `--primary`, `--secondary`, and design tokens correctly.
* **Transitions:** Keep micro-animations smooth using Framer Motion and `tw-animate-css`.

### E. Storage
* **Quiz Persistence:** Read and write quizzes and quiz results using standard utilities in `lib/quiz-storage.ts` which hook into `sessionStorage`. Do not inject custom or database storage adapters unless explicitly requested.

---

## 3. Workflow & Verification Checklist
1. **Linting & Formatting:** Ensure code adheres to prettier configuration by running `npm run format` and `npm run lint`.
2. **Type Safety:** Always run `npm run typecheck` to check for TypeScript errors.
3. **No Secret Exposures:** Never expose API keys or credentials. Use `GOOGLE_GENERATIVE_AI_API_KEY` defined locally in `.env.local`.

