import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import UserModuleProgress from './user-module-progress'
import { Button } from '@/components/ui/button'
import { BookOpen, Layers, GraduationCap, Award, Calendar } from 'lucide-react'
import { Expert, Lesson, Team, User } from '@/payload-types'
import Fallback from '../../fallback'
import UserModules from './user-modules'
import UserLessons from './user-lessons'
interface UserDetailsProps {
  user: User
}
function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

function isExpert(value: unknown): value is Expert {
  return typeof value === 'object' && value !== null && 'id' in value
}

const UserDetails = async ({ user }: UserDetailsProps) => {
  const {
    id,
    name,
    rank,
    join_date,
    group,
    lessons,
    education_levels,
    certificates,
    yds_score,
    university_names,
  } = user
  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Grup Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <Fallback />
      <Card
        className="w-full transition-all duration-300 hover:shadow-lg border-l-4"
        style={{ borderLeftColor: team?.color }}
      >
        <CardHeader className="flex flex-row w-full justify-between">
          <div className="flex flex-col justify-between items-start space-y-3">
            <div className="space-y-2">
              <Badge style={{ backgroundColor: team?.color }}>{groupName}</Badge>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-full bg-gray-100 font-medium">{rank}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(String(join_date)).toLocaleDateString()}</span>
            </div>
          </div>
        </CardHeader>

        {/* <CardContent>
          <div className="space-y-6">
            <UserModuleProgress
              requiredModules={groupModules}
              completedLessons={Array.isArray(lessons) ? lessons : []}
            />

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Layers className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold">Modüller</h4>
                <span className="ml-auto text-sm text-gray-600">{groupModules?.length} modül</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <UserModules lessons={lessons as Lesson[]} modules={groupModules} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Layers className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold">Takım Modülleri</h4>
                <span className="ml-auto text-sm text-gray-600">{team?.modules?.length} modül</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <UserModules lessons={lessons as Lesson[]} modules={team?.modules || []} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold">Eğitimler</h4>
                <span className="ml-auto text-sm text-gray-600">{lessons?.length} eğitim</span>
              </div>
              <div className="space-y-2">
                {lessons?.map((lesson: any) => (
                  <UserLessons key={lesson?.id} lesson={lesson} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold">Eğitim Bilgileri</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 p-4 rounded-lg border">
                  <h5 className="text-sm font-medium text-gray-500">Eğitim Durumu</h5>
                  <p className="text-lg font-semibold">{education_levels}</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg border">
                  <h5 className="text-sm font-medium text-gray-500">Üniversiteler</h5>
                  <div className="flex flex-wrap gap-2">
                    {university_names?.map((uniObj: any, index: number) => (
                      <Badge variant={'secondary'} key={uniObj.id || index}>
                        {uniObj.university}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-lg border">
                  <h5 className="text-sm font-medium text-gray-500">YDS Notu</h5>
                  <p className="text-lg font-semibold">{yds_score}</p>
                </div>

                <div className="space-y-2 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    <h5 className="text-sm font-medium text-gray-500">Sertifikalar</h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certificates?.map((cer: any, index: number) => (
                      <Badge variant={'secondary'} key={cer.id || index}>
                        {cer.certificate_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default UserDetails
