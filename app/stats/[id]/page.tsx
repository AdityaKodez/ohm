import { StatsDashboard } from "./stats-dashboard"

export default async function StatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <StatsDashboard id={id} />
}
