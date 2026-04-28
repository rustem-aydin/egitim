// components/pages/_drills/drills-list.tsx
import { NotFoundItem } from '@/components/not-found-item'
import DrillCard from './drill-card'
import { fetchDrills } from '@/actions/server/drills'

interface DrillsListProps {
  search?: string
  sort?: string
  user?: string
  drill_category?: string
}

const DrillsList = async ({
  search = '',
  sort = '',
  user = '',
  drill_category = '',
}: DrillsListProps) => {
  const grouped = await fetchDrills({ search, sort, user, drill_category })

  const sortedGroupKeys = Object.keys(grouped).sort()
  const totalDrills = sortedGroupKeys.reduce((total, key) => total + grouped[key].length, 0)

  if (!totalDrills) {
    return <NotFoundItem title="Tatbikat Bulunamadı" description="" />
  }

  return (
    <div className="mx-auto relative z-10 pt-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedGroupKeys.map((groupKey) => {
        const drills = grouped[groupKey]
        const group = drills[0].group as any
        const category = group?.category as any

        return (
          <DrillCard
            key={groupKey}
            groupName={group?.name ?? 'Diğer'}
            category={category}
            drills={drills}
          />
        )
      })}
    </div>
  )
}

export default DrillsList
