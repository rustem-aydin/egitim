import { getAllExperts } from '@/actions/experts'
import { getAllLessons } from '@/actions/lessons'
import { getAllModules } from '@/actions/modules'
import { getAllTeams } from '@/actions/teams'
import { getAllUsers } from '@/actions/users'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import GroupsList from '@/components/pages/groups/group-list'
import { getSortOptions, GroupsFilterParams } from '@/types/filters'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'

const mySortOptions = getSortOptions(['CREATED_AT_ASC', 'CREATED_AT_DESC', 'NAME_ASC', 'NAME_DESC'])

const GroupsPage = async ({
  searchParams,
}: {
  searchParams: Promise<GroupsFilterParams> // ← Promise
}) => {
  const lessons = await getAllLessons()
  const teams = await getAllTeams()
  const modules = await getAllModules()
  const users = await getAllUsers()
  const experts = await getAllExperts()
  const filter = await searchParams

  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className=" mx-auto relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Kadrolar</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Kadrolar
            </p>
          </div>
        </div>
        <FilterTab
          experts={experts}
          users={users}
          layoutOptions={['modular']}
          teams={teams}
          sortOptions={mySortOptions}
          modules={modules}
          lessons={lessons}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <GroupsList {...filter} />
      </div>
    </div>
  )
}

export default GroupsPage
