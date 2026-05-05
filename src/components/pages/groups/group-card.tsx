'use client'
import { Flag, FlaskConical, NetworkIcon, User } from 'lucide-react'
import DetailLink from '@/components/detail-link'
import MotionCard from '@/components/motion-card'
import { Group } from '@/payload-types'
import { Badge } from '../../ui/badge'
import Link from 'next/link'

interface GroupCardProps {
  group: Group
}

const GroupsCard = ({ group }: GroupCardProps) => {
  const team = group.team
  const teamData = typeof team === 'object' && team !== null ? team : null
  const cardColor = teamData?.color ?? '#A9A9A9'
  const userCount = Array.isArray(group.users?.docs) ? group.users.docs.length : 0
  const moduleCount = Array.isArray(group.modules) ? group.modules.length : 0

  return (
    <MotionCard>
      <div className=" rounded-2xl h-full backdrop-blur-sm border-2 shadow-lg bg-gradient-to-br from-background via-background/95 to-muted/30 text-start w-full mx-auto overflow-hidden  group">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top left, ${cardColor}, transparent 70%)`,
          }}
        />

        {/* {teamData && <TeamFlag position="bottom" team={teamData} />} */}

        <div className="relative z-10 p-4">
          <div className="flex justify-between items-start gap-4">
            {/* Sol taraf: Team ismi - shrink olmasın */}
            <div className="flex flex-col min-w-0 flex-1">
              <Link
                href={`/teams/${teamData?.id}`}
                key={teamData?.id}
                className="inline-flex items-center self-start border p-0.5 px-1 rounded-sm flex-shrink-0"
                style={{ backgroundColor: teamData?.color }}
              >
                <Flag color="#000" size={14} />
                <span className="text-xs text-black ml-1 font-semibold whitespace-nowrap">
                  {teamData?.name}
                </span>
              </Link>

              {/* Group name kalan alanı doldursun */}
              <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight mt-2 truncate">
                {group?.name}
              </h3>
            </div>

            {/* Sağ taraf: DetailLink */}
            <DetailLink route="groups" id={group?.id} />
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <Badge variant="secondary" className="gap-2">
              <User className="h-3 w-3" />
              <span>{userCount} Personel</span>
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <FlaskConical className="h-3 w-3" />
              <span>{moduleCount} Modül</span>
            </Badge>
          </div>
        </div>
        <NetworkIcon
          style={{ color: teamData?.color }}
          size={128}
          className="absolute bottom-0 right-0 opacity-5 hidden sm:block"
        />
      </div>
    </MotionCard>
  )
}

export default GroupsCard
