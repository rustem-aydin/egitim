// components/pages/_drills/drill-card.tsx
import { get } from 'http'
import DrillItems from './drill-items'
import type { Drill, DrillCategory } from '@/payload-types'
import { getGroupColors } from './drill-colors'

interface DrillCardProps {
  groupName: string
  category: DrillCategory | null
  drills: Drill[]
}

export default function DrillCard({ groupName, category, drills }: DrillCardProps) {
  const colors = getGroupColors(category?.color as string)
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-linear-to-br p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm`}
      style={colors.bgGradient}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className={`absolute -top-8 -left-8 h-32 w-32 animate-pulse rounded-full bg-linear-to-r `}
          style={colors.badgeStyle}
        />
        <div
          className={`absolute right-0 bottom-0 h-40 w-40 rounded-full bg-linear-to-r  blur-md`}
          style={colors.badgeStyle}
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <span
            className={`inline-block rounded-full bg-linear-to-r  px-6 py-3 text-lg font-bold text-white shadow-lg`}
            style={colors.badgeStyle}
          >
            {groupName}
          </span>
          <span className="text-sm border border-slate-400 text-black backdrop-blur-sm rounded-full px-3 py-1">
            {drills.length} tatbikat
          </span>
        </div>

        {/* Tatbikat listesi */}
        <div className="space-y-4">
          {drills.map((drill) => (
            <DrillItems key={drill.id} drill={drill} colors={colors} />
          ))}
        </div>
      </div>
    </div>
  )
}
