'use client'

import { ChartContainer } from '@/components/ui/chart'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

export const MiniBarChart = ({ data }: { data: { name: string; value: number }[] }) => (
  <ChartContainer config={{}} className="h-[300px] -ml-10 w-full">
    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
      <XAxis type="number" dataKey="value" domain={[0, 10]} hide />
      <YAxis
        dataKey="name"
        type="category"
        axisLine={false}
        tickLine={false}
        width={110}
        tick={{ fontSize: 12 }}
      />
      <Bar dataKey="value" radius={4} fill="var(--primary)">
        <LabelList
          dataKey="value"
          position="right"
          offset={8}
          className="fill-foreground"
          fontSize={12}
        />
      </Bar>
    </BarChart>
  </ChartContainer>
)
