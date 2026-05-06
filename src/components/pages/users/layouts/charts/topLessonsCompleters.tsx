'use client'

import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Customized } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { User } from '@/payload-types'

export const description = 'Personel Ders Tamamlama İstatistikleri'

const chartConfig = {
  temel: {
    label: 'Temel (A)',
    color: '#22c55e',
  },
  orta: {
    label: 'Orta (B)',
    color: '#f59e0b',
  },
  zor: {
    label: 'Zor (C)',
    color: '#ef4444',
  },
  kadro: {
    label: 'Kadro (K)',
    color: '#9333ea',
  },
} satisfies ChartConfig

type ChartDataItem = {
  personel: string
  temel: number
  orta: number
  zor: number
  kadro: number
  total: number
}

// Her personel grubu (4 bar) etrafına dashed border çizen custom layer
const GroupBorders = (props: any) => {
  const { xAxisMap, yAxisMap, offset, data } = props

  if (!xAxisMap || !yAxisMap || !offset || !data) return null

  const xAxis = Object.values(xAxisMap)[0] as any
  const yAxis = Object.values(yAxisMap)[0] as any

  if (!xAxis || !yAxis) return null

  const { x: offsetX, y: offsetY, height: chartH } = offset
  const bandWidth = xAxis.bandSize || xAxis.bandWidth || 0

  return (
    <g>
      {data.map((entry: any, index: number) => {
        const x = xAxis.scale(xAxis.dataKey ? entry[xAxis.dataKey] : index)
        const groupX = x - bandWidth / 2 + offsetX
        const groupY = offsetY
        const groupWidth = bandWidth
        const groupHeight = chartH

        return (
          <rect
            key={`border-${index}`}
            x={groupX + 4}
            y={groupY + 4}
            width={groupWidth - 8}
            height={groupHeight - 8}
            fill="transparent"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            rx={8}
            ry={8}
          />
        )
      })}
    </g>
  )
}

export function TopLessonsCompleters({ users }: { users: User[] }) {
  const chartData = useMemo<ChartDataItem[]>(() => {
    const data = users.map((user) => {
      const completedLessons =
        user.lessons?.filter((lesson: any) => lesson.status === 'Tamamlandı') ?? []

      let temel = 0
      let orta = 0
      let zor = 0
      let kadro = 0

      for (const lesson of completedLessons as any) {
        const code = lesson.module?.code ?? ''

        if (code.startsWith('A')) {
          temel += 1
        } else if (code.startsWith('B')) {
          orta += 1
        } else if (code.startsWith('C')) {
          zor += 1
        } else if (code.startsWith('K')) {
          kadro += 1
        }
      }

      return {
        personel: `${user.rank ?? ''} ${user.name ?? ''}`.trim(),
        temel,
        orta,
        zor,
        kadro,
        total: temel + orta + zor + kadro,
      }
    })

    return data.sort((a, b) => b.total - a.total)
  }, [users])

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personel Ders Tamamlama İstatistikleri</CardTitle>
          <CardDescription>Henüz tamamlanan ders bulunmamaktadır</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card style={{ height: 720, marginTop: 16 }}>
      <CardHeader>
        <CardTitle>Personel Ders Tamamlama İstatistikleri</CardTitle>
        <CardDescription>Kod gruplarına göre tamamlanan ders sayıları</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer style={{ height: 620, width: '100%' }} config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 30,
              top: 20,
              bottom: 10,
            }}
            barCategoryGap={24}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="personel"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload) return null

                const total = payload.reduce((sum, item) => sum + (item.value as number), 0)

                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <div className="mb-2 border-b pb-1.5">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        Toplam: <span className="font-medium text-foreground">{total} ders</span>
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {payload
                        .filter((item) => (item.value as number) > 0)
                        .map((item) => {
                          const config = chartConfig[item.dataKey as keyof typeof chartConfig]
                          return (
                            <div
                              key={String(item.dataKey)}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 rounded-sm"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {config?.label ?? String(item.name)}
                                </span>
                              </div>
                              <span className="text-sm font-medium tabular-nums">{item.value}</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="temel" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="orta" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="zor" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="kadro" fill="#9333ea" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Customized component={GroupBorders} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
