'use client'

import * as React from 'react'
import { GraduationCap, FlaskConical, Flag, Puzzle, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

import DetailLink from '@/components/detail-link'
import MotionCard from '@/components/motion-card'
import { Group, Lesson, Module, Team } from '@/payload-types'
import BadgeModule from './modules-badge-code'

interface ModulesCardProps {
  module: Module
}
export function ModuleCard({ module }: ModulesCardProps) {
  const lessons = module.lessons?.docs as Lesson[]
  const allTeams = module.teams?.docs as Team[]
  const allGroups = module.groups?.docs as Group[]
  const lessonCount = lessons.length || 0
  const teamCount = allTeams?.length || 0
  const cardStyle = React.useMemo(() => {
    const defaultColor = '#888888'

    if (!allTeams || allTeams.length === 0) {
      return {
        isGradient: false,
        borderBg: defaultColor,
        pillBg: `${defaultColor}15`,
        pillBorder: `${defaultColor}30`,
        pillColor: defaultColor,
        radialGradient: `radial-gradient(circle at 30% 20%, ${defaultColor}, transparent 60%)`,
      }
    }

    if (allTeams.length === 1) {
      const color = allTeams[0].color
      return {
        isGradient: false,
        borderBg: color,
        pillBg: `${color}15`,
        pillBorder: `${color}30`,
        pillColor: color,
        radialGradient: `radial-gradient(circle at 30% 20%, ${color}, transparent 60%)`,
      }
    }

    const colors = allTeams?.map((t) => t.color)
    return {
      isGradient: true,
      borderBg: `linear-gradient(135deg, ${colors.join(', ')})`,
      pillBg: `linear-gradient(90deg, ${colors.map((c) => `${c}15`).join(', ')})`,
      pillBorder: `${colors[0]}30`,
      pillColor: 'var(--foreground)',
      radialGradient: `radial-gradient(circle at 30% 20%, ${colors[0]}, transparent 60%)`,
    }
  }, [allTeams])

  return (
    <MotionCard>
      <div
        className="relative rounded-2xl p-0.5 shadow-2xl"
        style={{ background: cardStyle.borderBg }}
      >
        <div className="relative rounded-2xl bg-linear-to-br from-background via-background/95 to-muted/100 min-h-36 overflow-hidden">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: cardStyle.radialGradient }}
          />

          <div className="relative z-10 p-4 min-w-0">
            <div className="flex justify-between items-center">
              <div className="flex gap-1 min-w-0">
                <BadgeModule code={module?.code} />
                {allTeams?.map((team) => (
                  <Link
                    href={`/teams/${team.id}`}
                    key={team.id}
                    className="flex items-center border p-0.5 px-1 rounded-sm shrink-0"
                    style={{ backgroundColor: team?.color }}
                  >
                    <Flag color="#000" size={14}></Flag>
                    <span className="text-xs text-black ml-1 font-semibold truncate">
                      {team.name}
                    </span>
                  </Link>
                ))}
              </div>
              <DetailLink route="modules" id={module?.id} />
            </div>

            <h3 className="text-2xl font-bold truncate">{module.name}</h3>
            <p className="text-muted-foreground text-sm mb-4 truncate">{module.description}</p>

            <div className="flex gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: cardStyle.pillBg,
                  borderColor: cardStyle.pillBorder,
                  color: cardStyle.pillColor,
                }}
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-semibold">{lessonCount} Eğitim</span>
              </div>

              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: cardStyle.pillBg,
                  borderColor: cardStyle.pillBorder,
                  color: cardStyle.pillColor,
                }}
              >
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">{allGroups?.length} Kadro</span>
              </div>
            </div>
          </div>
        </div>
        <Puzzle size={128} className="absolute bottom-0 right-0 opacity-10 hidden sm:block" />
      </div>
    </MotionCard>
  )
}
