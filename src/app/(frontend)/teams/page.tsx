import { getAllGroups } from '@/actions/groups'
import { getAllLessons } from '@/actions/lessons'
import { getAllModules } from '@/actions/modules'
import { getAllTeams } from '@/actions/teams'
import { getAllUsers } from '@/actions/users'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import TeamList from '@/components/pages/teams/teams-list'
import { getSortOptions, TeamsFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions(['CREATED_AT_ASC', 'CREATED_AT_DESC', 'NAME_ASC', 'NAME_DESC'])
export const dynamic = 'force-dynamic'

const TeamsPage = async ({
  searchParams,
}: {
  searchParams: Promise<TeamsFilterParams> // ← Promise
}) => {
  const filter = await searchParams
  const modules = await getAllModules()
  const groups = await getAllGroups()
  const users = await getAllUsers()
  const lessons = await getAllLessons()
  return (
    <div className="min-h-screen  py-6 px-4 relative overflow-hidden">
      <div className=" mx-auto relative z-10">
        <div className="flex flex-row justify-between items-center">
          <div className="text-start space-y-4 mb-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Takımlar</h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              Siber Savunma Komutanlığına ait Takımlar
            </p>
          </div>
        </div>
        <FilterTab
          lessons={lessons}
          users={users}
          groups={groups}
          layoutOptions={['grid']}
          sortOptions={mySortOptions}
          modules={modules}
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <TeamList {...filter} />
      </div>
    </div>
  )
}

export default TeamsPage
