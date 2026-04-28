import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DetailLink from '@/components/detail-link'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import UserModuleProgress from './user-module-progress'
import { getTeamByGroupId } from '@/actions/server/teams'

interface UserCardProps {
  user: User
}

export async function UsersCard({ user }: UserCardProps) {
  const { id, name, rank, groups, lessons } = user

  const groupObj = typeof groups === 'object' && groups !== null ? groups : null
  const groupId = groupObj?.id
  const groupName = groupObj?.name || 'Grup Atanmamış'
  const groupModules = groupObj?.modules || []

  const team = await getTeamByGroupId(Number(groupId))

  return (
    <MotionCard>
      <Card
        className="w-full max-w-md transition-all duration-300 hover:shadow-lg border-l-4"
        style={{ borderLeftColor: team?.color }}
      >
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2 flex-1">
              {groupId ? (
                <Badge style={{ backgroundColor: team?.color }}>
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
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <UserModuleProgress
              requiredModules={groupModules}
              completedLessons={Array.isArray(lessons) ? lessons : []}
            />
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  )
}
