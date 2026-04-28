import { getAllCategories } from '@/actions/server/categories'
import { getAllGroups } from '@/actions/server/groups'
import { getAllLocations } from '@/actions/server/locations'
import { getAllTeams } from '@/actions/server/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import { LessonsTabs } from '@/components/pages/lessons/lessons-tabs'
import { getSortOptions, LessonFilterParams } from '@/types/filters'
import { Suspense } from 'react'
import { AddLessons } from '@/components/pages/lessons/add-lessons-modal'
const mySortOptions = getSortOptions([
  'DATE_FROM_DESC',
  'DATE_FROM_ASC',
  'NAME_DESC',
  'NAME_ASC',
  'LEVEL_DESC',
  'LEVEL_ASC',
])

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<LessonFilterParams>
}) {
  const filter = await searchParams
  const locations = await getAllLocations()
  const groups = await getAllGroups()
  const categories = await getAllCategories()
  const teams = await getAllTeams()

  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className="  relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Eğitimler</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Eğitimler
            </p>
          </div>
          <AddLessons />
        </div>
        <FilterTab
          dates
          status
          layoutOptions={['grid', 'chart', 'kanban', 'gant', 'table', 'calender']}
          sortOptions={mySortOptions}
          locations={locations}
          categories={categories}
          teams={teams}
          groups={groups}
          levels
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <LessonsTabs {...filter} />
      </div>
    </div>
  )
}
