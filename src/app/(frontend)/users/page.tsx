import { getAllGroups } from '@/actions/server/groups'
import { getAllLessonsDepth0 } from '@/actions/server/lessons'
import { getAllModules } from '@/actions/server/modules'
import { getAllTeams } from '@/actions/server/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import UsersList from '@/components/pages/users/users-list'
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
  const lessons = await getAllLessonsDepth0()
  const teams = await getAllTeams()
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
          layoutOptions={['grid']}
          lessons={lessons}
          completedModules={modules}
          inCompletedModules={modules}
          requiredButInCompletedModules={modules}
          groups={groups}
          edu_levels
          sortOptions={mySortOptions}
          teams={teams}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <UsersList {...filter} />
      </div>
    </div>
  )
}
