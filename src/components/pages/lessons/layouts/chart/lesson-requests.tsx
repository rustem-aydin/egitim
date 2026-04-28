'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Category, Lesson } from '@/payload-types'

export const description = 'En Çok İstekte Bulunulan Dersler'

const chartConfig = {
  requests: {
    label: 'İstek Sayısı',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartBarLessonRequests({ lessons }: { lessons: Lesson[] }) {
  const chartData = lessons.map((lesson) => ({
    name: lesson.name,
    requests: lesson.lesson_requests?.docs?.length || 0,
    color: (lesson.category as Category)?.color || '#888888',
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>En Çok İstekte Bulunulan Dersler</CardTitle>
        <CardDescription>Derslere yapılan istek sayıları</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="requests" radius={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          En çok istek alan dersleri gösteriyor <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Her ders için toplam istek sayısı</div>
      </CardFooter>
    </Card>
  )
}
