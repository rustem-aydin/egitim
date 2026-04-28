import { getAllGroups } from '@/actions/server/groups'
import { getAllLessonsDepth0 } from '@/actions/server/lessons'
import { getAllModules } from '@/actions/server/modules'
import { getAllTeams } from '@/actions/server/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import GroupsList from '@/components/groups/group-list'
import { getSortOptions, GroupsFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions(['CREATED_AT_ASC', 'CREATED_AT_DESC', 'NAME_ASC', 'NAME_DESC'])

const GroupsPage = async ({
  searchParams,
}: {
  searchParams: Promise<GroupsFilterParams> // ← Promise
}) => {
  const lessons = await getAllLessonsDepth0()
  const teams = await getAllTeams()
  const modules = await getAllModules()
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
          teams={teams}
          sortOptions={mySortOptions}
          modules={modules}
          lessons={lessons}
          search
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <GroupsList {...filter} />
      </div>
    </div>
  )
}

export default GroupsPage
