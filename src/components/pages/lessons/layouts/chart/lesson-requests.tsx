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
  const chartData = lessons
    .map((lesson) => ({
      name: lesson.name,
      requests: lesson.lesson_requests?.docs?.length || 0,
      color: (lesson.category as Category).color || '#888888',
    }))
    .filter((item) => item.requests > 0)
    .sort((a, b) => b.requests - a.requests)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>En Çok İstekte Bulunulan Dersler</CardTitle>
          <CardDescription>Henüz hiç istek bulunmuyor</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground">
          Talep edilen ders bulunmamaktadır.
        </CardContent>
      </Card>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-87.5  w-full">
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
  )
}
