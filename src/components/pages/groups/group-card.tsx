'use client'
import { ClipboardList, Network, User } from 'lucide-react'
import DetailLink from '@/components/detail-link'
import MotionCard from '@/components/motion-card'
import { Group } from '@/payload-types'
import { Badge } from '../../ui/badge'
import { TeamFlag } from './team-flag'

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
      <div
        className="rounded-2xl h-full backdrop-blur-sm border-2 shadow-lg bg-gradient-to-br from-background via-background/95 to-muted/20 text-start w-full mx-auto overflow-hidden relative group"
        style={{
          borderColor: cardColor,
          boxShadow: `0 8px 32px ${cardColor}20`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top left, ${cardColor}, transparent 70%)`,
          }}
        />

        {teamData && <TeamFlag position="bottom" team={teamData} />}

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${cardColor}15` }}>
              <Network className="h-6 w-6" style={{ color: cardColor }} />
            </div>
            <DetailLink route="groups" id={group?.id} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{group?.name}</h3>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="gap-2">
              <User className="h-3 w-3" />
              <span>{userCount} Personel</span>
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <ClipboardList className="h-3 w-3" />
              <span>{moduleCount} Zorunlu Modül</span>
            </Badge>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}

export default GroupsCard
