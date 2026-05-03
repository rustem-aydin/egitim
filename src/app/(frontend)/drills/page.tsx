import { getAllDrillCategories } from '@/actions/drills'
import { getAllUsers } from '@/actions/users'
import DrillsList from '@/components/pages/drills/drills-list'
import FilterTab from '@/components/filters/filter-tab'
import FilterLoading from '@/components/filters/filterLoading'
import { DrillFilterParams, getSortOptions } from '@/types/filters'
import { Suspense } from 'react'
const mySortOptions = getSortOptions(['CREATED_AT_DESC', 'CREATED_AT_ASC', 'NAME_DESC', 'NAME_ASC'])

const DrillsPage = async ({ searchParams }: { searchParams: Promise<DrillFilterParams> }) => {
  const { search, sort, user, drill_category } = await searchParams
  const drillCategories = await getAllDrillCategories()
  const users = await getAllUsers()
  return (
    <div className="min-h-screen py-6 px-4 relative overflow-hidden">
      <div className="mx-auto relative z-10">
        <div className="text-start space-y-4 mb-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Tatbikatlar</h2>
          <p className="text-muted-foreground text-lg whitespace-pre-line">
            Siber Savunma Komutanlığına ait Tatbikatlar
          </p>
        </div>
        <FilterTab
          layoutOptions={['grid', 'kanban', 'gant', 'table', 'calender']}
          users={users}
          drillCategories={drillCategories}
          sortOptions={mySortOptions}
        />

        <Suspense fallback={<FilterLoading />}></Suspense>
        <DrillsList search={search} sort={sort} user={user} drill_category={drill_category} />
      </div>
    </div>
  )
}

// İstersen gerçek bir skeleton yap

export default DrillsPage
