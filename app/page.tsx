import { ModeToggle } from "@/components/mode-toggle"
import { QuizCreator } from "@/components/home/quiz-creator"

export default function Page() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <QuizCreator />
    </>
  )
}
