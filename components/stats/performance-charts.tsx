import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { EmptyChartMessage } from "@/components/stats/empty-chart-message"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type QuizResult } from "@/lib/quiz-schema"
import { questionChartConfig, sectionChartConfig } from "@/lib/stats-format"

type SectionDatum = {
  section: string
  shortLabel: string
  score: number
  correct: number
  total: number
  fill: string
}

type QuestionDatum = {
  question: string
  score: number
  status: QuizResult["evaluatedAnswers"][number]["status"]
  fill: string
}

export function PerformanceCharts({
  sectionChartData,
  questionChartData,
}: {
  sectionChartData: SectionDatum[]
  questionChartData: QuestionDatum[]
}) {
  return (
<Tabs defaultValue="sections" className="contents">
  <Card size="sm">
    <CardHeader>
      <CardTitle className="text-lg font-medium">
        Performance Analysis
      </CardTitle>

      <CardAction>
        <TabsList className="grid-cols-2">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
      </CardAction>
    </CardHeader>

    <CardContent>
      <TabsContent value="sections" className="mt-4">
        {sectionChartData.length > 0 ? (
          <ChartContainer
            config={sectionChartConfig}
            className="h-52.5 w-full sm:h-57.5"
          >
            <BarChart
              accessibilityLayer
              data={sectionChartData}
              layout="vertical"
              margin={{ left: 0, right: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="shortLabel"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={68}
              />
              <XAxis type="number" domain={[0, 100]} hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_, payload) => {
                      const item = payload[0]?.payload as
                        | {
                            section?: string
                            correct?: number
                            total?: number
                          }
                        | undefined

                      return item?.section
                        ? `${item.section} (${item.correct}/${item.total})`
                        : "Section"
                    }}
                  />
                }
              />
              <Bar dataKey="score" radius={4}>
                {sectionChartData.map((entry) => (
                  <Cell key={entry.section} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyChartMessage>
            No section scores available.
          </EmptyChartMessage>
        )}
      </TabsContent>

      <TabsContent value="questions" className="mt-4">
        {questionChartData.length > 0 ? (
          <ChartContainer
            config={questionChartConfig}
            className="h-52.5 w-full sm:h-57.5"
          >
            <BarChart
              accessibilityLayer
              data={questionChartData}
              margin={{ left: 0, right: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="question"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={26}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="score" radius={4}>
                {questionChartData.map((entry) => (
                  <Cell key={entry.question} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyChartMessage>
            No question scores available.
          </EmptyChartMessage>
        )}
      </TabsContent>
    </CardContent>
  </Card>
</Tabs>
  )
}
