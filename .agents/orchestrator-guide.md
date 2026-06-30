# Subagent Orchestrator Guide

This guide explains how to use the subagent prompts in this `.agents/` directory. It is intended for the main orchestrator agent that coordinates work.

## Workflow: Subagent-Driven Development

For each task in a plan, follow this sequence:

```
1. Dispatch Implementer
   ├─> If NEEDS_CONTEXT: Provide context, goto 1.
   ├─> If BLOCKED: Assess and escalate.
   └─> If DONE / DONE_WITH_CONCERNS: Proceed to 2.

2. Dispatch Spec Compliance Reviewer
   ├─> If FAIL: Send feedback to Implementer, goto 1.
   └─> If PASS: Proceed to 3.

3. Dispatch Code Quality Reviewer
   ├─> If FAIL: Send feedback to Implementer, goto 1.
   └─> If PASS: Proceed to 4.

4. Mark Task Complete
```

**After all tasks are complete:**

```
5. Dispatch Final Integration Reviewer
   ├─> If REQUEST_CHANGES: Fix issues, goto 5.
   └─> If APPROVED: Use superpowers:finishing-a-development-branch to wrap up.
```

## File Index

| File | Role | When to Use |
|------|------|-------------|
| `implementer-prompt.md` | Implementer | For every task that requires coding. |
| `spec-reviewer-prompt.md` | Spec Compliance Reviewer | After implementer reports done. |
| `code-quality-reviewer-prompt.md` | Code Quality Reviewer | After spec review passes. |
| `test-writer-prompt.md` | Test Writer | When tests are missing or need updating. |
| `security-reviewer-prompt.md` | Security Reviewer | When touching auth, API routes, or data handling. |
| `accessibility-reviewer-prompt.md` | Accessibility Reviewer | When working on UI components. |
| `performance-review-prompt.md` | Performance Reviewer | When working on data-heavy or complex UI. |
| `docs-writer-prompt.md` | Documentation Writer | When adding user-facing features or APIs. |
| `final-integration-review-prompt.md` | Final Integration Reviewer | After all tasks are finished. |

## Important Rules

1. **Fresh Context:** Each subagent must be dispatched with a completely fresh context. Do not let them inherit your entire conversation history.
2. **Atomic Tasks:** Tasks given to an implementer should be small and atomic. If a task is too large, break it into smaller ones.
3. **No Skipping:** Never skip the spec review or code quality review. They are the gates that ensure quality.
4. **Model Selection:**
   - **Implementer:** Use a fast, cheap model for mechanical tasks; a standard model for integration tasks.
   - **Reviewers:** Use the most capable available model because they require broad reasoning and judgment.
5. **Communication:** If an implementer asks questions, answer them clearly. Do not rush them.

## Example Dispatch

To dispatch an implementer, use the model's agent tool with the prompt from `implementer-prompt.md` as the system prompt, and provide the task description and context in the user message.

```
System: [Contents of implementer-prompt.md]
User:
  Task: Add a "retry" button to the quiz submission flow.
  Context: The quiz submission API can occasionally fail. We need a button to let the user retry.
  Relevant Files:
    - app/api/submit-quiz/route.ts
    - components/quiz/QuizSubmitButton.tsx
```
