import { Team } from '@/payload-types'
import MotionCard from '../motion-card'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Building, Flag, Users } from 'lucide-react'
import DetailLink from '../detail-link'
import { Badge } from '../ui/badge'

export const TeamCard = ({ team }: { team: Team }) => {
  const groups = team.groups?.docs ?? []
  const memberCount = groups.reduce((acc: number, group: any) => {
    return acc + (group.users?.docs?.length ?? 0)
  }, 0)

  return (
    <MotionCard>
      <Card
        className="w-full max-w-md relative overflow-hidden backdrop-blur-sm bg-linear-to-br from-background to-muted/20"
        style={{
          border: `2px solid ${team.color}`,
          boxShadow: `0 12px 40px ${team.color}20, 0 4px 12px ${team.color}10`,
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${team.color}, transparent 70%)`,
          }}
        />

        <CardHeader className="px-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${team.color}20` }}
              >
                <Flag className="h-6 w-6" style={{ color: team.color }} />
              </div> */}
              <div>
                <h3 className="font-bold text-xl tracking-tight">{team.name}</h3>
                <div className="flex items-center gap-2 ">
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
            <DetailLink route="teams" id={team.id} />
          </div>
        </CardHeader>

        <CardContent className="px-6 pt-2 space-y-4 relative z-10">
          <div
            className="relative  rounded-xl overflow-hidden border min-h-28 p-4 space-y-4"
            style={{ borderColor: `${team.color}50` }}
          >
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              Dahil Olan Kadrolar
            </h4>
            <div className="flex flex-wrap gap-2">
              {groups.length > 0 ? (
                <>
                  {groups.slice(0, 4).map((group: any) => (
                    <Badge key={group.id} variant="secondary">
                      {group.name}
                    </Badge>
                  ))}
                  {groups.length > 4 && <Badge variant="outline">+{groups.length - 4} daha</Badge>}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Atanmış kadro yok.</p>
              )}
            </div>
          </div>
          <Flag
            style={{ color: `${team.color}` }}
            size={240}
            className="absolute bottom-0 right-0 opacity-5 hidden sm:block"
          />
        </CardContent>
      </Card>
    </MotionCard>
  )
}
