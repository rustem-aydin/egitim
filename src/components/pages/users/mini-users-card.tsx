import { Card, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import MotionCard from '@/components/motion-card'
import { User, Team } from '@/payload-types'

function isTeam(value: unknown): value is Team {
  return typeof value === 'object' && value !== null && 'color' in value
}

export async function MiniUsersCard({ user }: { user: User }) {
  const { name, group } = user

  const groupObj = typeof group === 'object' && group !== null ? group : null

  const team = isTeam(groupObj?.team) ? groupObj.team : null
  const teamColor = team?.color || '#6b7280'

  return (
    <MotionCard>
      <Card className="w-full relative p-2  border-l-4" style={{ borderLeftColor: teamColor }}>
        <CardHeader className="">
          <div className="flex flex-col justify-between items-start w-full">
            <Link href={`/users/${user?.id}`} className="text-md font-semibold leading-tight">
              {name}
            </Link>
          </div>
        </CardHeader>
      </Card>
    </MotionCard>
  )
}
