import React from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import Fallback from '@/components/fallback'
import Section from '@/components/section'
import { Group, Lesson, Module, Team } from '@/payload-types'
import BadgeModule from './modules-badge-code'
import { getUsersWhoTookModule } from '@/actions/server/modules'

interface ModuleDetailsProps {
  module: Module
}

const ModuleDetails = async ({ module }: ModuleDetailsProps) => {
  const lessons = module.lessons?.docs as Lesson[]
  const experts = module.experts?.docs as Group[]

  // ✅ Teams'i experts içinden çek ve tekrarları kaldır
  const teams = React.useMemo(() => {
    const allTeams = (module.experts?.docs || []).flatMap(
      (expert) => (expert as any).teams?.docs || [],
    ) as Team[]

    const uniqueTeams = allTeams.filter(
      (team, index, self) => index === self.findIndex((t) => t.id === team.id),
    )

    return uniqueTeams
  }, [module.experts])

  const users = await getUsersWhoTookModule(module?.id)

  const fallback = '#888888'
  let borderBg = fallback

  if (teams && teams.length > 0) {
    if (teams.length === 1) {
      borderBg = teams[0].color
    } else {
      borderBg = `linear-gradient(135deg, ${teams.map((t) => t.color).join(', ')})`
    }
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <Fallback />

      <div className="rounded-xl p-[2px] shadow-2xl" style={{ background: borderBg }}>
        <div className="rounded-xl bg-sidebar backdrop-blur-sm px-4 py-4">
          <div className="text-start pt-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BadgeModule code={module?.code} />

                  {teams?.map((team) => (
                    <Link
                      href={`/teams/${team.id}`}
                      key={team.id}
                      className="flex items-center p-1 rounded-full"
                      style={{ backgroundColor: team.color }}
                      title={team.name}
                    >
                      <Shield className="h-4 w-5 text-slate-700" />
                    </Link>
                  ))}
                </div>

                <h3 className="text-2xl font-bold mb-2">{module?.name}</h3>

                <p className="text-muted-foreground text-sm mb-6">{module?.description}</p>
              </div>
            </div>

            <Section data={users} name="name" path="/users/" title="Tamamlayan Personel" />

            <Section data={experts} name="name" path="/groups/" title="Uzmanlıklar" />

            <Section data={lessons} name="lesson_name" path="/lessons/" title="Eğitimler" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleDetails
