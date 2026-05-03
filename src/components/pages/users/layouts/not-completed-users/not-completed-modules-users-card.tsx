import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Expert, Lesson, Module } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { User as Us, BookOpen, CheckCircle2 } from 'lucide-react'
import { ModuleCompareCard } from '@/components/pages/modules/module-compare-card'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

function isExpert(value: unknown): value is Expert {
  return typeof value === 'object' && value !== null && 'id' in value
}

function isModule(value: unknown): value is Module {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value
}

// Kullanıcının aldığı modül ID'lerini çıkar (lessons'taki tüm dersler tamamlanmış sayılır)
function getCompletedModuleIds(lessons: Lesson[]): Set<number> {
  return new Set(
    lessons.map((lesson) => lesson.module).filter((m): m is number => typeof m === 'number'),
  )
}

// Tüm uzmanlıklardan populate edilmiş Module objelerini topla (tekrarsız)
function getAllRequiredModules(experts: Expert[]): Module[] {
  const seen = new Set<number>()
  const modules: Module[] = []

  experts.forEach((expert) => {
    const expertModules = expert.modules || []
    expertModules.forEach((mod) => {
      if (isModule(mod)) {
        if (!seen.has(mod.id)) {
          seen.add(mod.id)
          modules.push(mod)
        }
      }
    })
  })

  return modules
}

// Kullanıcının tamamladığı modül objelerini çıkar
function getCompletedModules(lessons: Lesson[], allModules: Module[]): Module[] {
  const completedIds = getCompletedModuleIds(lessons)
  return allModules.filter((mod) => completedIds.has(mod.id))
}

export async function NotCompletedModulesUsersCard({ user }: { user: User }) {
  const { id, name, group, lessons } = user

  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Grup Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'

  // Kullanıcının aldığı modül ID'leri
  const userLessons = lessons || []

  // Grubun uzmanlıklarından gerekli tüm Module objeleri (populate edilmiş)
  const experts = groupObj?.experts?.filter(isExpert) || []
  const requiredModules = getAllRequiredModules(experts)

  // Kullanıcının tamamladığı modül objeleri
  const completedModules = getCompletedModules(userLessons as Lesson[], requiredModules)

  return (
    <MotionCard>
      <Card
        className="w-full relative max-w-md transition-all duration-300 hover:shadow-lg border-l-4"
        style={{ borderLeftColor: teamColor }}
      >
        <CardHeader className="space-y-2">
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
                  Grup Yok
                </Badge>
              )}

              <h3 className="text-xl font-semibold leading-tight">{name}</h3>
            </div>
            <DetailLink route="users" id={Number(id)} />
          </div>
          <Us
            size={128}
            className="absolute -bottom-3 right-0 opacity-3 hidden sm:block"
            style={{
              color: `${teamColor}`,
            }}
          />
        </CardHeader>

        <CardContent>
          <ModuleCompareCard allModules={requiredModules} otherModules={completedModules} />
        </CardContent>
      </Card>
    </MotionCard>
  )
}
