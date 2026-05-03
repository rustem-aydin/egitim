import { Flag, Puzzle, CheckCheck } from 'lucide-react'
import Link from 'next/link'

import MotionCard from '@/components/motion-card'
import { Module, Team } from '@/payload-types'
import BadgeModule from './modules-badge-code'
import { getTeamsByExpertIds } from '@/actions/teams'

interface ModulesCardProps {
  module: Module
  isCompleted: boolean
}

// Module'deki expert ID'lerini çıkar
function getExpertIds(module: Module): number[] {
  if (!module.experts?.docs) return []

  return module.experts.docs.map((expert) => (typeof expert === 'number' ? expert : expert.id))
}

// Expert ID'lerinden tüm team'leri çek (tekrarsız)
async function getTeamsFromModule(module: Module): Promise<Team[]> {
  // Önce populate edilmiş teams'i kontrol et
  const populatedTeams = (module.experts?.docs || []).flatMap(
    (expert) => (expert as any).teams?.docs || [],
  ) as Team[]

  if (populatedTeams.length > 0) {
    return populatedTeams.filter(
      (team, index, self) => index === self.findIndex((t) => t.id === team.id),
    )
  }

  // Boşsa expert ID'lerinden çek
  const expertIds = getExpertIds(module)
  if (expertIds.length === 0) return []

  return await getTeamsByExpertIds(expertIds)
}

export async function MiniModuleCard({ module, isCompleted }: ModulesCardProps) {
  const teams = await getTeamsFromModule(module)

  const defaultColor = '#888888'

  let cardStyle

  if (!teams || teams.length === 0) {
    cardStyle = {
      borderBg: defaultColor,
      radialGradient: `radial-gradient(circle at 30% 20%, ${defaultColor}, transparent 60%)`,
    }
  } else if (teams.length === 1) {
    const color = teams[0].color
    cardStyle = {
      borderBg: color,
      radialGradient: `radial-gradient(circle at 30% 20%, ${color}, transparent 60%)`,
    }
  } else {
    const colors = teams.map((t) => t.color)
    cardStyle = {
      borderBg: `linear-gradient(135deg, ${colors.join(', ')})`,
      radialGradient: `radial-gradient(circle at 30% 20%, ${colors[0]}, transparent 60%)`,
    }
  }

  return (
    <MotionCard>
      <div className="rounded-2xl p-0.5 shadow-2xl" style={{ background: cardStyle.borderBg }}>
        <div className="relative rounded-2xl bg-linear-to-br from-background via-background/95 to-muted/100 overflow-hidden">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: cardStyle.radialGradient }}
          />

          <div className="relative flex items-center z-10 p-2 justify-between">
            <div className="flex justify-between gap-1">
              {isCompleted && <CheckCheck />}
              <p className="text-md font-bold">{module.name}</p>
            </div>
            <div className="flex gap-1">
              <BadgeModule code={module?.code} />
            </div>
          </div>
        </div>
        <Puzzle
          size={18}
          className="absolute bottom-0 right-0 left-0 mx-auto opacity-1 hidden sm:block"
        />
      </div>
    </MotionCard>
  )
}
