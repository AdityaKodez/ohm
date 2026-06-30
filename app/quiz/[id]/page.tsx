import { QuizRoom } from "./quiz-room"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <QuizRoom id={id} />
}
