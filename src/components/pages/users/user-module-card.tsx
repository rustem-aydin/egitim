import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Module } from '@/payload-types'
const BadgeModule = ({ code, completed }: { code: string; completed: boolean }) => {
  const char = String(code).charAt(0)
  const colorMap: Record<string, string> = {
    C: 'bg-red-500',
    B: 'bg-amber-500',
    A: 'bg-green-500',
    T: 'bg-blue-500',
  }
  const bgClass = colorMap[char] || 'bg-gray-500'

  if (!completed) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'rounded-md transition-all duration-200 border-dashed opacity-50 hover:opacity-80',
          'border-gray-400 text-gray-500',
        )}
      >
        <span className="text-sm font-semibold">{code}</span>
      </Badge>
    )
  }

  return (
    <Badge className={cn('rounded-md transition-all duration-200', bgClass)}>
      <span className="text-primary-foreground text-sm font-semibold">{code}</span>
    </Badge>
  )
}

interface ModuleGroupCardProps {
  title: string
  modules: Module[]
  completedModuleIds: Set<number>
  type: 'group' | 'team'
}

export const ModuleGroupCard = ({
  title,
  modules,
  completedModuleIds,
  type,
}: ModuleGroupCardProps) => {
  const completedCount = modules.filter((mod) => completedModuleIds.has(mod.id)).length
  const totalCount = modules.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Tamamlananları önce sırala, sonra tamamlanmayanları
  const sortedModules = [...modules].sort((a, b) => {
    const aCompleted = completedModuleIds.has(a.id)
    const bCompleted = completedModuleIds.has(b.id)
    if (aCompleted === bCompleted) return 0
    return aCompleted ? -1 : 1
  })

  return (
    <div className={cn('relative rounded-lg border p-3 transition-all')}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={'outline'}>%{percentage}</Badge>
        <h4 className={cn('text-sm font-semibold')}>{title}</h4>
        <span
          className={cn(
            'text-xs ml-auto font-medium',
            type === 'group' ? 'text-blue-500' : 'text-orange-500',
          )}
        >
          {type === 'group' ? 'Kadro' : 'Takım'}
        </span>
      </div>

      {modules.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Modül atanmamış</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sortedModules.map((mod) => {
            const isCompleted = completedModuleIds.has(mod.id)
            return (
              <div key={mod.id} className="group relative">
                <BadgeModule code={String(mod.code)} completed={isCompleted} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {mod.name}
                  {isCompleted && <span className="text-green-300 ml-1">✓ Tamamlandı</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
