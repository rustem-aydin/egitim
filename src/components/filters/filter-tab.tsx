'use client'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Filter, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react' // BUNU EKLİYORUZ
import FilterLoading from './filterLoading' // BUNU EKLİYORUZ

import SortSelect from './sort'
import SearchInput from './search'
import FilterDrillCategory from './filter-drill-category'
import {
  Category,
  DrillCategory,
  Expert,
  Group,
  Lesson,
  Location,
  Module,
  Team,
  User,
} from '@/payload-types'
import FilterUsers from './filter-users'
import FilterTeams from './filter-teams'
import FilterModuls from './filter-modules'
import FilterLocation from './filter-locations'
import FilterLevel from './filter-levels'
import FilterCategories from './filter-category'
import FilterGroups from './filter-groups'
import FilterLessons from './filter-lessons'
import FilterEduLevel from './filter-edu-level'
import FilterCompletedModules from './filter-completed-modules'
import FilterInCompletedModules from './filter-incompleted-modules'
import FilterRequiredIncompletedModules from './filter-required-incompleted-modules'
import Layout from './filter-layout'
import { SortOption } from '@/types/types'
import FilterLessonsStatus from './filter-lesson-status'
import FilterLimit from './filter-limit'
import { date } from 'zod/v4'
import FilterDate from './filter-date'
import FilterExpert from './filter-expert'
import { FilterLove } from './filter-love'
import FilterModules from './filter-modules'

interface FilterProps {
  levels?: boolean
  dates?: boolean
  edu_levels?: boolean
  status?: boolean
  completedModule?: Module[]
  inCompletedModules?: Module[]
  requiredButInCompletedModules?: Module[]
  groups?: Group[]
  categories?: Category[]
  lessons?: Lesson[]
  users?: User[]
  modules?: Module[]
  locations?: Location[]
  teams?: Team[]
  drillCategories?: DrillCategory[]
  sortOptions: SortOption[]
  layoutOptions: string[]
}
const FilterTab = ({
  drillCategories,
  sortOptions,
  completedModule,
  dates,
  inCompletedModules,
  requiredButInCompletedModules,
  groups,
  users,
  status,
  layoutOptions,
  edu_levels,
  lessons,
  levels,
  teams,
  locations,
  modules,
  categories,
}: FilterProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const hasParams = searchParams.toString().length > 0

  const clearURL = () => {
    startTransition(() => {
      router.push(pathname)
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <div className="flex h-auto min-h-5 items-end space-x-2   text-sm">
        <FilterLimit startTransition={startTransition} />
        <div className="flex-1 min-w-80">
          <SearchInput startTransition={startTransition} />
        </div>
        {users && <FilterUsers users={users || []} startTransition={startTransition} />}
        {teams && <FilterTeams teams={teams || []} startTransition={startTransition} />}
        {modules && <FilterModules modules={modules || []} startTransition={startTransition} />}
        {completedModule && (
          <FilterModules
            title="Tamamlanan Modüller"
            urlParams="completedModule"
            modules={completedModule || []}
            startTransition={startTransition}
          />
        )}

        {locations && (
          <FilterLocation locations={locations || []} startTransition={startTransition} />
        )}
        {categories && (
          <FilterCategories categories={categories || []} startTransition={startTransition} />
        )}
        {levels && <FilterLevel startTransition={startTransition} />}
        {edu_levels && <FilterEduLevel startTransition={startTransition} />}
        {drillCategories && (
          <FilterDrillCategory
            drillCategories={drillCategories || []}
            startTransition={startTransition}
          />
        )}
        {groups && <FilterGroups groups={groups || []} startTransition={startTransition} />}
        {lessons && <FilterLessons lessons={lessons || []} startTransition={startTransition} />}

        {inCompletedModules && (
          <FilterInCompletedModules
            modules={inCompletedModules || []}
            startTransition={startTransition}
          />
        )}
        {requiredButInCompletedModules && (
          <FilterRequiredIncompletedModules
            modules={requiredButInCompletedModules || []}
            startTransition={startTransition}
          />
        )}
        {status && <FilterLessonsStatus startTransition={startTransition} />}
        {dates && <FilterDate startTransition={startTransition} />}
        <SortSelect sortOptions={sortOptions} startTransition={startTransition} />
        <Layout options={layoutOptions} startTransition={startTransition} />
        <FilterLove />

        <Button
          className="min-w-10"
          disabled={!hasParams}
          onClick={clearURL}
          size={'icon'}
          variant={'outline'}
        >
          <X />
        </Button>
      </div>

      {isPending ? <FilterLoading /> : <div className="h-1 bg-gray-500 mt-2 rounded-4xl"></div>}
    </div>
  )
}

export default FilterTab
