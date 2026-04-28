import { getAllModules } from '@/actions/server/modules'
import { getAllTeams } from '@/actions/server/teams'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import TeamList from '@/components/teams/teams-list'
import { getSortOptions, TeamsFilterParams } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions(['CREATED_AT_ASC', 'CREATED_AT_DESC', 'NAME_ASC', 'NAME_DESC'])

const TeamsPage = async ({
  searchParams,
}: {
  searchParams: Promise<TeamsFilterParams> // ← Promise
}) => {
  const filter = await searchParams
  const modules = await getAllModules()
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
          sortOptions={mySortOptions}
          modules={modules} // Modül filtresini aktif eder
          search // Arama filtresini aktif eder
        />
        <Suspense fallback={<FilterLoading />}></Suspense>
        <TeamList {...filter} />
      </div>
    </div>
  )
}

export default TeamsPage
