'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap, Users, Shield } from 'lucide-react'
import Link from 'next/link'

import DetailLink from '@/components/detail-link'
import MotionCard from '@/components/motion-card'
import { Group, Lesson, Module, Team } from '@/payload-types'
import BadgeModule from './modules-badge-code'

interface ModulesCardProps {
  module: Module
}
export function ModuleCard({ module }: ModulesCardProps) {
  const [setIsHovered] = React.useState(false)

  const lessons = module.lessons?.docs as Lesson[]
  const groups = module.groups?.docs as Group[]
  const teams = module.teams?.docs as Team[]

  const lessonCount = lessons.length || 0
  const groupCount = groups?.length || 0

  const cardStyle = React.useMemo(() => {
    const defaultColor = '#888888'

    if (!teams || teams.length === 0) {
      return {
        isGradient: false,
        borderBg: defaultColor,
        pillBg: `${defaultColor}15`,
        pillBorder: `${defaultColor}30`,
        pillColor: defaultColor,
        radialGradient: `radial-gradient(circle at 30% 20%, ${defaultColor}, transparent 60%)`,
      }
    }

    if (teams.length === 1) {
      const color = teams[0].color
      return {
        isGradient: false,
        borderBg: color,
        pillBg: `${color}15`,
        pillBorder: `${color}30`,
        pillColor: color,
        radialGradient: `radial-gradient(circle at 30% 20%, ${color}, transparent 60%)`,
      }
    }

    const colors = teams?.map((t) => t.color)
    return {
      isGradient: true,
      borderBg: `linear-gradient(135deg, ${colors.join(', ')})`,
      pillBg: `linear-gradient(90deg, ${colors.map((c) => `${c}15`).join(', ')})`,
      pillBorder: `${colors[0]}30`,
      pillColor: 'var(--foreground)',
      radialGradient: `radial-gradient(circle at 30% 20%, ${colors[0]}, transparent 60%)`,
    }
  }, [teams])

  return (
    <MotionCard>
      <div
        className="rounded-2xl  p-[2px] shadow-2xl"
        style={{ background: cardStyle.borderBg }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative  rounded-2xl   bg-gradient-to-br from-background via-background/95 to-muted/100 min-h-66 overflow-hidden">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: cardStyle.radialGradient }}
          />

          <div className="relative z-10 p-6 pb-4">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
              <div className="flex gap-1">
                <BadgeModule code={module?.code} />
                {teams?.map((team) => (
                  <Link
                    href={`/teams/${team.id}`}
                    key={team.id}
                    className="flex items-center p-1 rounded-full"
                    style={{ backgroundColor: team.color }}
                  >
                    <Shield className="h-4 w-5 text-slate-700" />
                  </Link>
                ))}
              </div>
              <DetailLink route="modules" id={module?.id} />
            </div>

            <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
            <p className="text-muted-foreground text-sm mb-6">{module.description}</p>

            <div className="flex gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: cardStyle.pillBg,
                  borderColor: cardStyle.pillBorder,
                  color: cardStyle.pillColor,
                }}
              >
                <GraduationCap className="h-4 w-4" />
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
                <span className="text-sm font-semibold">{groupCount} Kadro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}
