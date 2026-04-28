import { AnimatedTabsContent, Tabs } from '@/components/ui/tabs'
import { LessonFilterParams } from '@/types/filters'
import { fetchLessons } from '@/actions/server/lessons'
import LessonKanban from './layouts/kanban/kanban'
import LessonsList from './layouts/grid/lessons-list'
import { CategoryGanttChart } from './layouts/gant/gant'
import { getAllDrills } from '@/actions/server/drills'
import Main from './layouts/chart/main'

export async function LessonsTabs(props: LessonFilterParams) {
  const activeTab = props.layout
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchLessons({ ...props, page })))
  const allLessons = results.flatMap((result) => result?.data || [])
  const hasNextPage = results[results.length - 1]?.hasNextPage || false
  console.log(JSON.stringify(allLessons, null, 2))
  const drilss = await getAllDrills()
  return (
    <div className="flex w-full  items-center">
      <Tabs value={activeTab || 'grid'}>
        <AnimatedTabsContent value="grid">
          <LessonsList lessons={allLessons} currentPage={currentPage} hasNextPage={hasNextPage} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="chart">
          <Main lessons={allLessons} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="kanban">
          <LessonKanban lessons={allLessons} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="gant">
          <CategoryGanttChart lessons={allLessons} drills={drilss} />
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
