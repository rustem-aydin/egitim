import { Card, CardHeader } from '@/components/ui/card'
import { Users, Flag } from 'lucide-react'
import { Team } from '@/payload-types'
import { getUserByIds } from '@/actions/users'

export async function TeamDetails({ team }: { team: Team }) {
  const groups = team.groups?.docs ?? []
  // src/components/pages/teams/team-details.tsx
  const users = await getUserByIds(
    groups.flatMap(
      (group: any) => group.users.docs.map((user: any) => user.id), // ← .id ekle!
    ),
  )
  const memberCount = users.length
  return (
    <div className="max-w-4xl w-full mx-auto ">
      <Card
        className="w-full relative overflow-hidden bg-gradient-to-br from-background to-muted/20"
        style={{
          border: `2px solid ${team.color}`,
          boxShadow: `0 12px 40px ${team.color}20, 0 4px 12px ${team.color}10`,
        }}
      >
        <CardHeader className="p-6 relative z-10">
          <div className="flex items-start">
            <div className="flex items-center gap-4 w-full">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${team.color}20` }}
              >
                <Flag className="h-8 w-8" style={{ color: team.color }} />
              </div>
              <div>
                <h3 className="font-bold text-2xl tracking-tight">{team.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${team.color}15`,
                      color: team.color,
                    }}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>{memberCount} Personel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
