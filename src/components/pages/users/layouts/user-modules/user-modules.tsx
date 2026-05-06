import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Lesson, Module } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getPayload } from 'payload'
import config from '@payload-config'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

// ─── SERVER FUNCTION ─────────────────────────────────────────────

export const getModuleByIds = async (ids: number[], depth: number = 0): Promise<Module[]> => {
  if (!ids || ids.length === 0) return []

  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'modules',
    where: { id: { in: ids } },
    limit: ids.length,
    depth,
  })

  return (drill.docs || []) as Module[]
}

// ─── BADGE COMPONENT ─────────────────────────────────────────────

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

// ─── MODULE GROUP CARD ───────────────────────────────────────────

interface ModuleGroupCardProps {
  title: string
  modules: Module[]
  completedModuleIds: Set<number>
  type: 'group' | 'team'
}

const ModuleGroupCard = ({ title, modules, completedModuleIds, type }: ModuleGroupCardProps) => {
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export async function UsersCard({ user }: { user: User }) {
  const { id, name, group, lessons } = user
  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Kadro Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'
  const teamName = team?.name || 'Takım Atanmamış'

  // Tamamlanan modül ID'lerini topla
  const completedModuleIds = new Set(
    (Array.isArray(lessons) ? (lessons as Lesson[]) : [])
      .map((lesson) => (typeof lesson.module === 'number' ? lesson.module : lesson.module?.id))
      .filter((id): id is number => typeof id === 'number'),
  )

  // Group modülleri
  const groupModuleIds = Array.isArray(groupObj?.modules)
    ? groupObj.modules
        .map((m) => (typeof m === 'number' ? m : m.id))
        .filter((id): id is number => typeof id === 'number')
    : []

  // Team modülleri
  const teamModuleIds = Array.isArray(team?.modules)
    ? team.modules
        .map((m) => (typeof m === 'number' ? m : m.id))
        .filter((id): id is number => typeof id === 'number')
    : []

  // Modülleri fetch et
  const [groupModules, teamModules] = await Promise.all([
    getModuleByIds(groupModuleIds),
    getModuleByIds(teamModuleIds),
  ])

  return (
    <MotionCard>
      <Card
        className="w-full relative max-w-2xl transition-all duration-300 hover:shadow-lg border-l-4"
        style={{ borderLeftColor: teamColor }}
      >
        <CardHeader className="">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2 flex-1">
              {groupId ? (
                <Badge style={{ backgroundColor: teamColor }}>
                  <Link className="hover:underline" href={`/groups/${groupId}`}>
                    {groupName}
                  </Link>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Kadro Yok
                </Badge>
              )}

              <h3 className="text-xl font-semibold leading-tight">{name}</h3>
            </div>
            <DetailLink route="users" id={Number(id)} />
          </div>
        </CardHeader>

        <CardContent
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className=" overflow-y-scroll z-10 scrollbar-hide"
        >
          <div className="grid grid-cols-1 gap-3">
            {/* Kadro Modülleri */}
            <ModuleGroupCard
              title={groupName}
              modules={groupModules}
              completedModuleIds={completedModuleIds}
              type="group"
            />

            {/* Takım Modülleri */}
            <ModuleGroupCard
              title={teamName}
              modules={teamModules}
              completedModuleIds={completedModuleIds}
              type="team"
            />

            {/* Hiç modül yoksa */}
            {groupModules.length === 0 && teamModules.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-gray-400">Atanmış modül bulunmuyor</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  )
}
