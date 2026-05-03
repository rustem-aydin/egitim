import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Expert, Lesson, Module } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { User as Us, CheckCircle2, XCircle, BookOpen } from 'lucide-react'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

function isExpert(value: unknown): value is Expert {
  return typeof value === 'object' && value !== null && 'id' in value
}

// Module ID'sini güvenli şekilde çıkar
function getModuleId(moduleRef: number | Module): number {
  return typeof moduleRef === 'number' ? moduleRef : moduleRef.id
}

// Kullanıcının tamamladığı modül ID'lerini çıkar (lessons'taki tüm dersler tamamlanmış sayılır)
function getCompletedModuleIds(lessons: Lesson[]): Set<number> {
  return new Set(
    lessons.map((lesson) => lesson.module).filter((m): m is number => typeof m === 'number'),
  )
}

// Uzmanlık için modül durumlarını hesapla
interface ModuleStatus {
  moduleId: number
  status: 'completed' | 'not-started'
}

function getExpertModuleStatuses(expert: Expert, completedModules: Set<number>): ModuleStatus[] {
  const requiredModules = (expert.modules || []).map(getModuleId)

  return requiredModules.map((moduleId) => {
    if (completedModules.has(moduleId)) {
      return { moduleId, status: 'completed' as const }
    }
    return { moduleId, status: 'not-started' as const }
  })
}

// İlerleme yüzdesini hesapla
function calculateProgress(statuses: ModuleStatus[]): number {
  if (statuses.length === 0) return 0
  const completed = statuses.filter((s) => s.status === 'completed').length
  return Math.round((completed / statuses.length) * 100)
}

// Durum ikonu
function StatusIcon({ status }: { status: ModuleStatus['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
    case 'not-started':
      return <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
  }
}

// Durum metni
function StatusText({ status }: { status: ModuleStatus['status'] }) {
  switch (status) {
    case 'completed':
      return <span className="text-green-600 text-xs">Tamamlandı</span>
    case 'not-started':
      return <span className="text-gray-400 text-xs">Başlanmadı</span>
  }
}

export async function NotCompletedModulesUsersCard({ user }: { user: User }) {
  const { id, name, group, lessons } = user

  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Grup Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'

  // Kullanıcının tamamladığı modül ID'lerini hesapla (tüm lessons tamamlanmış sayılır)
  const userLessons = lessons || []
  const completedModuleIds = getCompletedModuleIds(userLessons as Lesson[])

  // Uzmanlıkları hazırla
  const experts = groupObj?.experts?.filter(isExpert) || []

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

        <CardContent className="space-y-4">
          {/* Genel İstatistikler */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{userLessons.length} Ders</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>{completedModuleIds.size} Modül Tamamlandı</span>
            </div>
          </div>

          {/* Uzmanlıklar ve Modül Durumları */}
          {experts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Uzmanlık Alanları & Modül İlerlemesi
              </h4>

              {experts.map((expert) => {
                const moduleStatuses = getExpertModuleStatuses(expert, completedModuleIds)
                const progress = calculateProgress(moduleStatuses)

                return (
                  <div key={expert.id} className="rounded-lg border bg-card p-3 space-y-2">
                    {/* Uzmanlık Başlığı ve İlerleme */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{expert.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: progress === 100 ? '#22c55e' : teamColor,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{progress}%</span>
                      </div>
                    </div>

                    {/* Modül Listesi */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {moduleStatuses.map(({ moduleId, status }) => (
                        <div
                          key={moduleId}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50"
                        >
                          <StatusIcon status={status} />
                          <span className="text-xs font-medium">Modül {moduleId}</span>
                          <StatusText status={status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Uzmanlık yoksa bilgi mesajı */}
          {experts.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-2">
              Bu kullanıcıya atanmış uzmanlık alanı bulunmuyor.
            </div>
          )}
        </CardContent>
      </Card>
    </MotionCard>
  )
}
