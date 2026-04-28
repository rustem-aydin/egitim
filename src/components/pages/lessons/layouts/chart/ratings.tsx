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

export const description = 'En Yüksek Puanlı Dersler'

const chartConfig = {
  rating: {
    label: 'Puan',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartBarRatings({ lessons }: { lessons: Lesson[] }) {
  const chartData = lessons
    .filter((lesson) => {
      const hasRating = lesson.rating !== null && lesson.rating !== undefined
      return hasRating
    })

    .map((lesson) => ({
      name: lesson.name,
      rating: lesson.rating as number,
      color: (lesson.category as Category).color || '#888888',
    }))
    .sort((a, b) => b?.rating - a?.rating)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>En Yüksek Puanlı Dersler</CardTitle>
          <CardDescription>Henüz değerlendirme yapılmamış</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground">
          Değerlendirme yapılan ders bulunmamaktadır.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>En Yüksek Puanlı Dersler</CardTitle>
        <CardDescription>Derslere verilen puanlar</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="rating" radius={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          En yüksek puanlı dersleri gösteriyor <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Her ders için ortalama puan</div>
      </CardFooter>
    </Card>
  )
}
