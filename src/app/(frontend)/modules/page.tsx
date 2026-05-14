import { getAllGroups } from '@/actions/groups'
import { getAllLessons } from '@/actions/lessons'
import { getAllTeams } from '@/actions/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import { ModulesTab } from '@/components/pages/modules/layouts/modules-tab'
import ModulesList from '@/components/pages/modules/modules-list'
import { getSortOptions, ModuleFilterParams } from '@/types/filters'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'

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
  searchParams: Promise<ModuleFilterParams>
}) {
  const filter = await searchParams
  const groups = await getAllGroups()
  const lessons = await getAllLessons()
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
          layoutOptions={['grid', 'sankey']}
          lessons={lessons}
          groups={groups}
          sortOptions={mySortOptions}
          levels
          teams={teams}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <ModulesTab {...filter} />
      </div>
    </div>
  )
}
