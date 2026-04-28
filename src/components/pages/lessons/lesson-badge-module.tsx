import { Module } from '@/payload-types'
import { Badge } from '../../ui/badge'

// ✅ Tipi genişlet
const BadgeModule = ({ module }: { module: number | Module | null | undefined }) => {
  // null, undefined veya number kontrolü
  if (!module || typeof module === 'number') {
    return (
      <Badge
        variant="outline"
        className="bg-gray-500/70 border-gray-500 border-dashed border-2 rounded-sm gap-1"
      >
        <span className="text-md text-white">Modül Atanmadı</span>
      </Badge>
    )
  }

  // Burada artık sadece Module tipi var
  const char = String(module.code).charAt(0)

  const colorMap: Record<string, string> = {
    C: 'bg-red-500/70 border-red-500',
    B: 'bg-amber-500/70 border-amber-500',
    A: 'bg-green-500/70 border-green-500',
  }

  const className = colorMap[char] ?? 'bg-gray-500/70 border-gray-500'

  return (
    <Badge variant="outline" className={`${className} rounded-sm gap-1`}>
      <span className="text-md text-white">{module.code}</span>
    </Badge>
  )
}

export default BadgeModule
