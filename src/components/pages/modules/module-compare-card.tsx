import { Card, CardContent, CardHeader } from '@/components/ui/card'
import MotionCard from '@/components/motion-card'
import { Module } from '@/payload-types'
import { MiniModuleCard } from '@/components/pages/modules/mini-modules-card'

// otherModules ID'lerini Set'e at
function getOtherModuleIds(otherModules: Module[]): Set<number> {
  return new Set(otherModules.map((m) => m.id))
}

interface ModuleCompareCardProps {
  allModules: Module[]
  otherModules?: Module[]
}

export function ModuleCompareCard({ allModules, otherModules }: ModuleCompareCardProps) {
  // Kıyaslama varsa otherModules ID'lerini al
  const otherIds = otherModules ? getOtherModuleIds(otherModules) : null

  return (
    <MotionCard>
      <Card className="w-full ">
        <CardContent className="h-[400px] overflow-y-auto ">
          <div className="grid grid-cols-1 gap-2">
            {allModules.map((module) => {
              const isCompleted = otherIds ? otherIds.has(module.id) : false
              return <MiniModuleCard key={module.id} module={module} isCompleted={isCompleted} />
            })}
          </div>
        </CardContent>
      </Card>
    </MotionCard>
  )
}
