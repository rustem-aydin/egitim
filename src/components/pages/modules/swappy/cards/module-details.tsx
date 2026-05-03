import React from 'react'
import Link from 'next/link'
import { Flag } from 'lucide-react'
import { Group, Lesson, Module, Team } from '@/payload-types'
import BadgeModule from '../../modules-badge-code'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MiniLessonCard from '../../../lessons/mini-lesson-card'

const ModuleDetails = async ({ module }: { module: Module }) => {
  const lessons = module.lessons?.docs as Lesson[]

  const teams = React.useMemo(() => {
    const allTeams = (module.experts?.docs || []).flatMap(
      (expert) => (expert as any).teams?.docs || [],
    ) as Team[]

    const uniqueTeams = allTeams.filter(
      (team, index, self) => index === self.findIndex((t) => t.id === team.id),
    )

    return uniqueTeams
  }, [module.experts])

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
    <div className="rounded-xl  p-0.5 shadow-2xl" style={{ background: borderBg }}>
      <div className="rounded-xl bg-sidebar backdrop-blur-sm px-4 py-4">
        <div className="text-start pt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-1">
                <BadgeModule code={module?.code} />
                {teams?.map((team) => (
                  <Link
                    href={`/teams/${team.id}`}
                    key={team.id}
                    className="flex items-center border  p-0.5 px-1 rounded-sm"
                    style={{ backgroundColor: team?.color }}
                  >
                    <Flag color="#000" size={14}></Flag>
                    <span className="text-xs text-black ml-1 font-semibold">{team.name}</span>
                  </Link>
                ))}
              </div>

              <h3 className="text-2xl font-bold mb-2">{module?.name}</h3>

              <p className="text-muted-foreground text-sm mb-6">{module?.description}</p>
            </div>
          </div>

          {/* <Section data={users} name="name" path="/users/" title="Tamamlayan Personel" />

          <Section data={experts} name="name" path="/groups/" title="Uzmanlıklar" /> */}

          <Card>
            <CardHeader>
              <CardTitle>Eğitimler</CardTitle>
              <CardDescription>Module ait Eğitimler</CardDescription>
              <CardContent className="p-0">
                {lessons?.length === 0 && (
                  <p className="text-xl truncate text-foreground sm:text-sm font-bold">
                    Ders bulunamadı
                  </p>
                )}
                {lessons?.map((lesson) => (
                  <MiniLessonCard lesson={lesson} />
                ))}
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ModuleDetails
