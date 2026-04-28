'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useRouter } from 'next/navigation'
import { Category, Lesson } from '@/payload-types'

// Lesson tipi (API'den gelen veri yapısına göre ayarla)

function transformLessonsToChartData(lessons: Lesson[]) {
  // Her ders için popülerlik skoru hesapla
  const scoredLessons = lessons.map((lesson) => {
    let score = 0
    score = lesson.users?.docs?.length || 0

    // switch (sortBy) {
    //   case 'users':
    //     // Kullanıcı sayısına göre (users.docs uzunluğu)
    //     break
    //   case 'feedbacks':
    //     // Feedback sayısına göre
    //     score = lesson.feedbacks?.docs?.length || 0
    //     break
    //   case 'status':
    //     // Status'a göre puanlama (Tamamlandı = yüksek puan)
    //     score = lesson.status === 'Tamamlandı' ? 1 : 0
    //     break
    //   default:
    //     // Varsayılan: kullanıcı sayısı
    //     score = lesson.users?.docs?.length || 0
    // }

    return {
      id: lesson.id,
      name: lesson.name,
      value: score,
      fill: (lesson.category as Category)?.color || `hsl(${(lesson.id * 137.508) % 360}, 70%, 50%)`,
      status: lesson.status,
      module: typeof lesson.module === 'object' ? lesson.module?.name : undefined,
      studentCount: lesson.users?.docs?.length || 0,
      feedbackCount: lesson.feedbacks?.docs?.length || 0,
    }
  })

  // Skora göre azalan sırala ve limit kadar al
  return scoredLessons.sort((a, b) => b.value - a.value)
}

export function MostCompletedLessonsChart({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter()

  // Dışarıdan gelen lessons array'ini chart verisine dönüştür
  const chartData = React.useMemo(() => {
    if (!lessons || lessons.length === 0) return []
    return transformLessonsToChartData(lessons)
  }, [lessons])

  const chartConfig = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return {}
    const config: ChartConfig = {
      value: { label: 'Katılımcı Sayısı' },
    }
    chartData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [chartData])

  return (
    <ChartContainer config={chartConfig} className="h-[350px]  w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, bottom: 75 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          angle={-45}
          textAnchor="end"
          tickFormatter={(value) => (value.length > 20 ? value.slice(0, 20) + '...' : value)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              className="justify-center"
              formatter={(value, name, item) => (
                <div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex flex-1 justify-between">
                      <span>{'Kaç Kişi Aldı: '}</span>
                      <span className="font-medium">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor: item.payload.fill,
                          }}
                        />
                        {value}
                      </span>
                    </div>
                  </div>
                  {item.payload.module && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Modül: {item.payload.module}
                    </div>
                  )}
                </div>
              )}
            />
          }
        />

        <Bar
          dataKey="value"
          radius={5}
          cursor="pointer"
          onClick={(data: any) => {
            if (data && data.id) {
              router.push(`/lessons/${data.id}`)
            }
          }}
        >
          <LabelList
            dataKey="value"
            position="top"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
          {chartData?.map((entry) => (
            <Cell key={`cell-${entry.id}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
