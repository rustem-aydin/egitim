import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Shield, Users, Building, ClipboardList } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Fallback from '@/components/fallback'
import Link from 'next/link'
import { Team } from '@/payload-types'
import { getUserByIds } from '@/actions/users'
import BadgeModule from '../modules/modules-badge-code'

export async function TeamDetails({ team }: { team: Team }) {
  const groups = team.groups?.docs ?? []
  // const requiredModules = team.modules ?? []

  // Tüm group'ların users.docs'larını tek array'e topla
  const users = await getUserByIds(groups.flatMap((group: any) => group.users?.docs ?? []))
  const memberCount = users.length
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <Fallback />
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
                <Shield className="h-8 w-8" style={{ color: team.color }} />
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
                    <span>{memberCount} Üye</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-6 relative z-10">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kadrolar */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                Takıma Dahil Kadrolar ({groups.length})
              </h4>
              <div className="space-y-2 flex flex-col pr-2 rounded-md border p-2">
                {groups.length > 0 ? (
                  groups.map((group: any) => (
                    <Link
                      href={`/groups/${group.id}`}
                      key={group.id}
                      className="text-sm p-2 rounded-md hover:bg-muted/50"
                    >
                      {group.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Bu takıma atanmış kadro bulunmuyor.
                  </p>
                )}
              </div>
            </div>

            {/* Personeller */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                Takıma Dahil Personeller ({users.length})
              </h4>
              <div className="space-y-2 flex flex-col pr-2 rounded-md border p-2">
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <Link
                      href={`/users/${user.id}`}
                      key={user.id}
                      className="text-sm p-2 rounded-md hover:bg-muted/50"
                    >
                      {user.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Bu takıma atanmış personel bulunmuyor.
                  </p>
                )}
              </div>
            </div>

            {/* Modüller */}
            {/* <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                Takım İçin Zorunlu Modüller ({requiredModules.length})
              </h4>
              <div className="space-y-2 flex flex-col pr-2 rounded-md border p-2">
                {requiredModules.length > 0 ? (
                  requiredModules.map((module: any) => (
                    <Link
                      href={`/modules/${module.id}`}
                      key={module.id}
                      className="text-sm p-2 rounded-md hover:bg-muted/50 flex justify-between items-center"
                    >
                      <span>{module.name}</span>
                      <BadgeModule code={module.code} />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-2">
                    Bu takıma atanmış zorunlu modül bulunmuyor.
                  </p>
                )}
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
