import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModuleGroupCard } from '../user-module-card'
import { Lesson, Module, Team, User } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

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

const UserModulesDetails = async ({ user }: { user: User }) => {
  const { group, lessons } = user
  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupName = groupObj?.name || 'Kadro Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
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
    <Card>
      <CardHeader>
        <CardTitle>Modüller</CardTitle>
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
  )
}

export default UserModulesDetails
