import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Lesson, Module } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ModuleGroupCard } from '../../user-module-card'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

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

// ─── MODULE GROUP CARD ───────────────────────────────────────────

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
