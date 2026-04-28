import { getAllCategories } from '@/actions/server/categories'
import { getAllGroups } from '@/actions/server/groups'
import { getAllLessonsDepth0 } from '@/actions/server/lessons'
import { getAllTeams } from '@/actions/server/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import ModulesList from '@/components/modules/modules-list'
import { getSortOptions, ModuleFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions([
  'CREATED_AT_ASC',
  'CREATED_AT_DESC',
  'NAME_ASC',
  'NAME_DESC',
  'LEVEL_DESC',
  'LEVEL_ASC',
])

export default async function ModulesPage({
  searchParams,
}: {
  searchParams: Promise<ModuleFilterParams> // ← Promise
}) {
  const filter = await searchParams
  const groups = await getAllGroups()
  const categories = await getAllCategories()
  const lessons = await getAllLessonsDepth0()
  const teams = await getAllTeams()
  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className=" mx-auto relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Modüller</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Modüller
            </p>
          </div>
        </div>
        <FilterTab
          layoutOptions={['grid', 'kanban', 'gant', 'table', 'calender']}
          lessons={lessons}
          search
          groups={groups}
          sortOptions={mySortOptions}
          levels
          categories={categories}
          teams={teams}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <ModulesList {...filter} />
      </div>
    </div>
  )
}
