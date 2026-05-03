import { getAllExperts } from '@/actions/experts'
import { getAllGroups } from '@/actions/groups'
import { getAllLessons } from '@/actions/lessons'
import { getAllModules } from '@/actions/modules'
import { getAllTeams } from '@/actions/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import { UsersTab } from '@/components/pages/users/layouts/users-tab'
import { getSortOptions, UsersFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions([
  'CREATED_AT_ASC',
  'CREATED_AT_DESC',
  'NAME_ASC',
  'NAME_DESC',
  'LEVEL_DESC',
  'LEVEL_ASC',
])

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<UsersFilterParams> // ← Promise
}) {
  const filter = await searchParams
  const groups = await getAllGroups()
  const lessons = await getAllLessons(1)
  const teams = await getAllTeams()
  const experts = await getAllExperts()
  const modules = await getAllModules()
  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className=" mx-auto relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Personeller</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Personeller
            </p>
          </div>
        </div>
        <FilterTab
          completedModule={modules}
          experts={experts}
          layoutOptions={['grid', 'notCompletedModulesUsers']}
          lessons={lessons}
          groups={groups}
          sortOptions={mySortOptions}
          teams={teams}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <UsersTab {...filter} />
      </div>
    </div>
  )
}
