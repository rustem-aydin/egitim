import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team, Expert, Lesson } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import UserModuleProgress from './user-expert-badge'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

function isExpert(value: unknown): value is Expert {
  return typeof value === 'object' && value !== null && 'id' in value
}

export async function UsersCard({ user }: { user: User }) {
  const { id, name, rank, group, lessons } = user

  const groupObj = typeof group === 'object' && group !== null ? group : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Grup Atanmamış'

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'

  const experts = Array.isArray(groupObj?.experts) ? groupObj.experts.filter(isExpert) : []

  return (
    <MotionCard>
      <Card
        className="w-full max-w-md transition-all duration-300 hover:shadow-lg border-l-4"
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
          <div className="flex justify-between text-sm text-gray-600">
            <span>{rank}</span>
            {team && <span style={{ color: teamColor }}>{team.name}</span>}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <UserModuleProgress
              experts={experts}
              completedLessons={(Array.isArray(lessons) ? lessons : []) as Lesson[]}
            />
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  )
}
