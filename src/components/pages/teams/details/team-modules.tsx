import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Module } from '@/payload-types'
import { MiniModuleCard } from '../../modules/mini-modules-card'

const TeamModules = ({ modules }: { modules: Module[] }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle>Zorunlu Modüller</CardTitle>
        <CardDescription>Takıma Ait Zorunlu Modüller</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {modules.map((module) => {
          return <MiniModuleCard isCompleted={false} key={module.id} module={module} />
        })}
      </CardContent>
    </Card>
  )
}

export default TeamModules
