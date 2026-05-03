import { AnimatedTabsContent, Tabs } from '@/components/ui/tabs'
import { LessonFilterParams } from '@/types/filters'
import ExpertsList from './layouts/grid/experts-list'
import { fetchExperts } from '@/actions/experts'

export async function ExpertsTab(props: LessonFilterParams) {
  const activeTab = props.layout
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchExperts({ ...props, page })))
  const allExperts = results.flatMap((result) => result?.data || [])
  const hasNextPage = results[results.length - 1]?.hasNextPage || false
  return (
    <div className="flex w-full  items-center">
      <Tabs value={activeTab || 'grid'}>
        <AnimatedTabsContent value="grid">
          <ExpertsList experts={allExperts} currentPage={currentPage} hasNextPage={hasNextPage} />
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
