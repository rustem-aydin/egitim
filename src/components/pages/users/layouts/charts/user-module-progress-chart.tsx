'use client'

import * as React from 'react'
import { Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface UserModuleChartProps {
  user: any
}

const categoryColors: Record<string, string> = {
  A: '#22c55e', // green-500
  B: '#f59e0b', // amber-500
  C: '#ef4444', // red-500
  K: '#3b82f6', // purple-600
}

const categoryLabels: Record<string, string> = {
  A: 'Temel (A)',
  B: 'Orta (B)',
  C: 'Zor (C)',
  K: 'Kadro (K)',
}

// Opaklık ekleyen helper
const withOpacity = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const chartConfig = {
  grupAT: { label: 'Grup - Temel (A)', color: categoryColors.A },
  grupAK: { label: 'Grup - Temel (Kalan)', color: withOpacity(categoryColors.A, 0.1) },
  grupBT: { label: 'Grup - Orta (B)', color: categoryColors.B },
  grupBK: { label: 'Grup - Orta (Kalan)', color: withOpacity(categoryColors.B, 0.1) },
  grupCT: { label: 'Grup - Zor (C)', color: categoryColors.C },
  grupCK: { label: 'Grup - Zor (Kalan)', color: withOpacity(categoryColors.C, 0.1) },
  grupKT: { label: 'Grup - Kadro (K)', color: categoryColors.K },
  grupKK: { label: 'Grup - Kadro (Kalan)', color: withOpacity(categoryColors.K, 0.1) },
  takimAT: { label: 'Takım - Temel (A)', color: categoryColors.A },
  takimAK: { label: 'Takım - Temel (Kalan)', color: withOpacity(categoryColors.A, 0.1) },
  takimBT: { label: 'Takım - Orta (B)', color: categoryColors.B },
  takimBK: { label: 'Takım - Orta (Kalan)', color: withOpacity(categoryColors.B, 0.1) },
  takimCT: { label: 'Takım - Zor (C)', color: categoryColors.C },
  takimCK: { label: 'Takım - Zor (Kalan)', color: withOpacity(categoryColors.C, 0.1) },
  takimKT: { label: 'Takım - Kadro (K)', color: categoryColors.K },
  takimKK: { label: 'Takım - Kadro (Kalan)', color: withOpacity(categoryColors.K, 0.1) },
} satisfies ChartConfig
export function UserModuleChart({ user }: UserModuleChartProps) {
  const { groupData, teamData } = React.useMemo(() => {
    const completedModuleIds = new Set(
      (user.lessons || []).map((l: any) => l.module?.id).filter(Boolean),
    )

    const getModuleCategory = (code: string) => {
      const char = String(code || '')
        .charAt(0)
        .toUpperCase()
      if (['A', 'B', 'C', 'K', 'T'].includes(char)) return char
      return 'X'
    }

    const processModules = (modules: any[], source: 'grup' | 'takim') => {
      // HATA DÜZELTMESİ: Record<string, ...> tiplemesi eklendi
      const counts: Record<string, { completed: number; remaining: number }> = {
        A: { completed: 0, remaining: 0 },
        B: { completed: 0, remaining: 0 },
        C: { completed: 0, remaining: 0 },
        K: { completed: 0, remaining: 0 },
        T: { completed: 0, remaining: 0 },
        X: { completed: 0, remaining: 0 },
      }

      const seenIds = new Set<number>()

      ;(modules || []).forEach((mod: any) => {
        if (!mod || seenIds.has(mod.id)) return
        seenIds.add(mod.id)

        const cat = getModuleCategory(mod.code)
        const isCompleted = completedModuleIds.has(mod.id)

        // Artık counts[cat] ile erişirken TS hata vermeyecek çünkü cat string ve counts Record<string, ...>
        if (isCompleted) {
          counts[cat].completed++
        } else {
          counts[cat].remaining++
        }
      })

      const chartData: any[] = []

      for (const [cat, count] of Object.entries(counts)) {
        const keyPrefix = `${source}${cat}`

        if (count.completed > 0) {
          chartData.push({
            name:
              chartConfig[`${keyPrefix}T` as keyof typeof chartConfig]?.label ||
              `${source} - ${categoryLabels[cat]} - Tamamlanan`,
            value: count.completed,
            fill: `var(--color-${keyPrefix}T)`,
          })
        }
        if (count.remaining > 0) {
          chartData.push({
            name:
              chartConfig[`${keyPrefix}K` as keyof typeof chartConfig]?.label ||
              `${source} - ${categoryLabels[cat]} - Kalan`,
            value: count.remaining,
            fill: `var(--color-${keyPrefix}K)`,
          })
        }
      }

      return chartData
    }

    return {
      groupData: processModules(user.group?.modules, 'grup'),
      teamData: processModules(user.group?.team?.modules, 'takim'),
    }
  }, [user])

  if (groupData.length === 0 && teamData.length === 0) {
    return null
  }

  return (
    <Card className="flex flex-col ">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {user.rank} {user.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] px-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" indicator="line" />} />
            <Pie
              data={groupData}
              dataKey="value"
              nameKey="name"
              outerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
            />
            <Pie
              data={teamData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={90}
              strokeWidth={2}
              stroke="var(--background)"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="text-center text-xs text-muted-foreground mt-2 ">
        <div className="flex justify-center gap-3 flex-wrap">
          <span>
            İç halka: <span className="font-medium text-foreground">Grup</span>
          </span>
          <span>
            Dış halka: <span className="font-medium text-foreground">Takım</span>
          </span>
        </div>
        <div className="flex justify-center gap-2 mt-2">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: categoryColors.A }}></span>{' '}
            Temel
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: categoryColors.B }}></span>{' '}
            Orta
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: categoryColors.C }}></span>{' '}
            Zor
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: categoryColors.K }}></span>{' '}
            Kadro
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
