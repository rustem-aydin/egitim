import { getAllGroups } from '@/actions/groups'
import { getAllLessons } from '@/actions/lessons'
import { getAllModules } from '@/actions/modules'
import { getAllTeams } from '@/actions/teams'
import { getAllUsers } from '@/actions/users'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import { ExpertsTab } from '@/components/pages/experts/expert-tabs'
import { getSortOptions, GroupsFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions(['CREATED_AT_ASC', 'CREATED_AT_DESC', 'NAME_ASC', 'NAME_DESC'])

const ExpertsPage = async ({ searchParams }: { searchParams: Promise<GroupsFilterParams> }) => {
  const lessons = await getAllLessons()
  const teams = await getAllTeams()
  const modules = await getAllModules()
  const groups = await getAllGroups()
  const users = await getAllUsers()
  const filter = await searchParams

  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className=" mx-auto relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Uzmanlıklar</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Uzmanlıklar
            </p>
          </div>
        </div>
        <FilterTab
          groups={groups}
          users={users}
          layoutOptions={['modular']}
          teams={teams}
          sortOptions={mySortOptions}
          modules={modules}
          lessons={lessons}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <ExpertsTab {...filter} />
      </div>
    </div>
  )
}

export default ExpertsPage
