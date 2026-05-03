import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Expert, Lesson, Module } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Network, Flag, Layers, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { User as Us } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

function isExpert(value: unknown): value is Expert {
  return typeof value === 'object' && value !== null && 'id' in value
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

// ─── HELPER FUNCTIONS ────────────────────────────────────────────

function getModuleIds(modules: number[] | Module[] | undefined): number[] {
  if (!modules || !Array.isArray(modules) || modules.length === 0) return []
  if (typeof modules[0] === 'number') return modules as number[]
  return (modules as Module[]).map((m) => m.id)
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

// ─── EXPERT CARD COMPONENT ───────────────────────────────────────

interface ExpertCardProps {
  expert: Expert
  completedModuleIds: Set<number>
  isCommon: boolean
  source: 'group' | 'team'
  resolvedModules: Module[]
}

const ExpertCard = ({
  expert,
  completedModuleIds,
  isCommon,
  source,
  resolvedModules,
}: ExpertCardProps) => {
  const completedCount = resolvedModules.filter((mod) => completedModuleIds.has(mod.id)).length
  const totalCount = resolvedModules.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className={cn('relative rounded-lg border p-2 transition-all')}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={'outline'}>%{percentage}</Badge>

        <h4 className={cn('text-sm font-semibold')}>{expert.name}</h4>
        <span className="text-xs text-gray-400 ml-auto">
          {isCommon ? 'Ortak' : source === 'group' ? 'Kadro' : 'Takım'}
        </span>
      </div>

      {resolvedModules.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            {resolvedModules.map((mod) => {
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
        </>
      ) : (
        <p className="text-xs text-gray-400 italic">Modül atanmamış</p>
      )}
    </div>
  )
}

interface OtherExpertCardProps {
  expert: Expert
  resolvedModules: Module[]
  completedModuleIds: Set<number>
}

const OtherExpertCard = ({ expert, resolvedModules, completedModuleIds }: OtherExpertCardProps) => {
  const completedCount = resolvedModules.filter((mod) => completedModuleIds.has(mod.id)).length
  const totalCount = resolvedModules.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  return (
    <div className={cn('relative rounded-lg border p-2 transition-all ')}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={'outline'} className="">
          %{percentage}
        </Badge>

        <h4 className={cn('text-sm font-semibold text-purple-800 dark:text-purple-200')}>
          {expert.name}
        </h4>
        <span className="text-xs text-purple-500 ml-auto font-medium">Diğer</span>
      </div>

      {resolvedModules.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {resolvedModules.map((mod) => {
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
      ) : (
        <p className="text-xs text-gray-400 italic">Modül atanmamış</p>
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

  const groupExperts = Array.isArray(groupObj?.experts) ? groupObj.experts.filter(isExpert) : []
  const teamExperts = Array.isArray(team?.experts) ? team.experts.filter(isExpert) : []

  const groupExpertIds = new Set(groupExperts.map((e) => e.id))
  const teamExpertIds = new Set(teamExperts.map((e) => e.id))
  const commonExpertIds = new Set([...groupExpertIds].filter((id) => teamExpertIds.has(id)))

  const completedModuleIds = new Set(
    (Array.isArray(lessons) ? (lessons as Lesson[]) : [])
      .map((lesson) => (typeof lesson.module === 'number' ? lesson.module : lesson.module?.id))
      .filter((id): id is number => typeof id === 'number'),
  )

  // ─── TÜM ATANMIŞ MODÜL ID'LERİNİ TOPLA ────────────────────────
  const assignedModuleIds = new Set<number>()

  for (const expert of groupExperts) {
    getModuleIds(expert.modules as Module[]).forEach((id) => assignedModuleIds.add(id))
  }
  for (const expert of teamExperts) {
    getModuleIds(expert.modules as Module[]).forEach((id) => assignedModuleIds.add(id))
  }

  // ─── DİĞER MODÜLLERİ VE EXPERTLERİNİ BUL ──────────────────────
  // lessons.module obje olarak geliyor, experts içeriyor
  const otherExpertsMap = new Map<number, Expert>()
  const otherExpertModuleIdsMap = new Map<number, Set<number>>()

  for (const lesson of Array.isArray(lessons) ? (lessons as Lesson[]) : []) {
    const mod = lesson.module
    if (typeof mod === 'number') continue

    const modId = mod?.id
    if (!modId) continue

    // FIX 1: experts {docs: [...]} formatını doğru handle et
    const modExperts = mod.experts
    let expertList: unknown[] = []

    if (Array.isArray(modExperts)) {
      expertList = modExperts
    } else if (modExperts && typeof modExperts === 'object' && 'docs' in modExperts) {
      expertList = (modExperts as { docs: unknown[] }).docs
    }

    for (const exp of expertList) {
      if (!isExpert(exp)) continue

      // Bu expert zaten group/team'de varsa atla
      if (groupExpertIds.has(exp.id) || teamExpertIds.has(exp.id)) continue

      // Expert'i daha önce map'e eklememişsek ekle
      if (!otherExpertsMap.has(exp.id)) {
        otherExpertsMap.set(exp.id, exp)

        // FIX 2: Sadece bu dersin modülünü değil,
        // Expert'in sahip olduğu TÜM modüllerin ID'lerini set'e ekle
        const expertAllModuleIds = getModuleIds(exp.modules as number[] | Module[])
        otherExpertModuleIdsMap.set(exp.id, new Set(expertAllModuleIds))
      }
    }
  }

  // ─── HER EXPERT İÇİN MODÜLLERİ FETCH ET ───────────────────────
  const expertModulesMap = new Map<number, Module[]>()

  for (const expert of groupExperts) {
    const modIds = getModuleIds(expert.modules as Module[])
    if (modIds.length > 0) {
      const mods = await getModuleByIds(modIds)
      expertModulesMap.set(expert.id, mods)
    } else {
      expertModulesMap.set(expert.id, [])
    }
  }

  for (const expert of teamExperts) {
    if (!commonExpertIds.has(expert.id)) {
      const modIds = getModuleIds(expert.modules as Module[])
      if (modIds.length > 0) {
        const mods = await getModuleByIds(modIds)
        expertModulesMap.set(expert.id, mods)
      } else {
        expertModulesMap.set(expert.id, [])
      }
    }
  }

  // Diğer expert'lerin modüllerini fetch et (depth: 1 ile experts de gelir ama gerek yok, zaten biliyoruz)
  const otherExpertResolvedModules = new Map<number, Module[]>()
  for (const [expId, modIdSet] of otherExpertModuleIdsMap) {
    const modIds = Array.from(modIdSet)
    if (modIds.length > 0) {
      const mods = await getModuleByIds(modIds)
      otherExpertResolvedModules.set(expId, mods)
    } else {
      otherExpertResolvedModules.set(expId, [])
    }
  }

  // Expert'leri birleştir
  const allExperts: Array<{
    expert: Expert
    source: 'group' | 'team'
    isCommon: boolean
    resolvedModules: Module[]
  }> = []

  for (const expert of groupExperts) {
    const isCommon = commonExpertIds.has(expert.id)
    allExperts.push({
      expert,
      source: 'group',
      isCommon,
      resolvedModules: expertModulesMap.get(expert.id) || [],
    })
  }

  for (const expert of teamExperts) {
    if (!commonExpertIds.has(expert.id)) {
      allExperts.push({
        expert,
        source: 'team',
        isCommon: false,
        resolvedModules: expertModulesMap.get(expert.id) || [],
      })
    }
  }

  return (
    <MotionCard>
      <Card
        className="w-full relative max-w-2xl  transition-all duration-300 hover:shadow-lg border-l-4"
        style={{ borderLeftColor: teamColor }}
      >
        <CardHeader className=" ">
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
              <p className="text-sm text-gray-500">
                {groupName} / {teamName}
              </p>
            </div>
            <DetailLink route="users" id={Number(id)} />
          </div>
        </CardHeader>

        <CardContent
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="h-85 overflow-y-scroll z-10 scrollbar-hide"
        >
          {/* Experts Grid */}
          <div className="grid grid-cols-1  gap-3">
            {allExperts.map(({ expert, source, isCommon, resolvedModules }) => (
              <ExpertCard
                key={`${source}-${expert.id}`}
                expert={expert}
                completedModuleIds={completedModuleIds}
                isCommon={isCommon}
                source={source}
                resolvedModules={resolvedModules}
              />
            ))}

            {/* Diğer Expert'ler - Her biri ayrı kart, başlık expert adı */}
            {Array.from(otherExpertsMap.entries()).map(([expId, expert]) => (
              <OtherExpertCard
                key={`other-${expId}`}
                expert={expert}
                resolvedModules={otherExpertResolvedModules.get(expId) || []}
                completedModuleIds={completedModuleIds}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  )
}
