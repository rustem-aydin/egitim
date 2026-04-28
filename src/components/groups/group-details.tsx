// app/groups/[id]/group-details.tsx
import { ClipboardList, Network, Shield, Trash2, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Fallback from '@/components/fallback'
import { Group, Module, Team, User as PayloadUser } from '@/payload-types'
import { Badge } from '../ui/badge'
import BadgeModule from '../modules/modules-badge-code'

interface GroupDetailsProps {
  group: Group
}

const GroupDetails = ({ group }: GroupDetailsProps) => {
  const team = group.team as Team
  const modules = Array.isArray(group.modules)
    ? (group.modules.filter((m) => typeof m === 'object') as Module[])
    : []

  const users = Array.isArray(group.users?.docs)
    ? (group.users.docs.filter((u) => typeof u === 'object') as PayloadUser[])
    : []

  // Takım modülleri: team'e bağlı modules

  const cardColor = team?.color ?? '#A9A9A9'

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <Fallback />
      <Card
        className="w-full relative overflow-hidden bg-gradient-to-br from-background to-muted/20"
        style={{
          border: `1px solid ${cardColor}`,
          boxShadow: `0 8px 32px ${cardColor}20`,
        }}
      >
        <div
          className="absolute top-0 left-0 h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${cardColor}, transparent)` }}
        />

        <CardHeader className="px-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-start gap-2">
              {team && (
                <Badge
                  className="mt-2 border-none text-white flex items-center gap-1.5"
                  style={{ backgroundColor: cardColor }}
                >
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-semibold">{team.name}</span>
                </Badge>
              )}
              <div className="flex gap-2 justify-center">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${cardColor}15` }}>
                  <Network className="h-6 w-6" style={{ color: cardColor }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{group.name}</h2>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <Separator className="my-6" style={{ backgroundColor: `${cardColor}30` }} />

          <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase">Zorunlu Modül</p>
              <p className="text-4xl font-bold tracking-tighter" style={{ color: cardColor }}>
                {modules.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase">Toplam Personel</p>
              <p className="text-4xl font-bold tracking-tighter" style={{ color: cardColor }}>
                {users.length}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Personel Listesi
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {users.length > 0 ? (
                users.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`}>
                    <Badge className="mr-2 mb-2 p-2 rounded-lg">{user.name}</Badge>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Bu kadroda personel bulunmuyor.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {/* Zorunlu Modüller */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                Gruba Ait Modüller
              </h4>
              <div>
                {modules.length > 0 ? (
                  modules.map((mod) => (
                    <Link key={mod.id} href={`/modules/${mod.id}`}>
                      <Badge
                        variant="secondary"
                        className="mr-2 mb-2 h-9  gap-2 text-sm rounded-lg"
                      >
                        <BadgeModule code={mod.code} />
                        {mod.name}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Atanmış modül yok.</p>
                )}
              </div>
            </div>

            {/* Takım Modülleri */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                Takıma Ait Modülleri
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {(team?.modules as Module[]).length > 0 ? (
                  (team?.modules as Module[]).map((mod) => (
                    <Link key={mod.id} href={`/modules/${mod.id}`}>
                      <Badge
                        variant="secondary"
                        className="mr-2 mb-2 h-9  gap-2 text-sm rounded-lg"
                      >
                        <BadgeModule code={mod.code} />
                        {mod.name}
                      </Badge>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Atanmış modül yok.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroupDetails
