import { Card, CardContent } from '@/components/ui/card'
import { Expert, Module } from '@/payload-types'
import { FlaskConical } from 'lucide-react'
import BadgeModule from '../modules/modules-badge-code'
import { Badge } from '@/components/ui/badge'
import DetailLink from '@/components/detail-link'

const ExpertCard = ({ expert }: { expert: Expert }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-7xl  w-full">
        <Card className="p-0 ring-0 border rounded-2xl relative h-full max-w-xl w-full mx-auto">
          <CardContent className="p-0">
            <div className="ps-6 py-4 flex flex-col gap-4 justify-between">
              <div className="flex justify-between mr-2">
                <div>
                  <p className="text-lg font-medium text-card-foreground">{expert.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{expert.description}</p>
                </div>
                <DetailLink route="experts" id={expert.id} />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-xs font-normal text-muted-foreground">{'Modüller'}</p>
                <div className="flex flex-row items-center gap-1 mt-1 flex-wrap">
                  {(expert.modules as Module[]).length === 0 && <Badge>Modül bulunamadı</Badge>}
                  {(expert.modules as Module[]).slice(0, 7).map((module) => (
                    <BadgeModule key={module?.id} code={module?.code} />
                  ))}
                  {(expert.modules as Module[]).length > 7 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(expert.modules as Module[]).length - 7} daha
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <FlaskConical
              size={128}
              className="absolute bottom-0 text-gray-500/20 right-0 hidden sm:block"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ExpertCard
