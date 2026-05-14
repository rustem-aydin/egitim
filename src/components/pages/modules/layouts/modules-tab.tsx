import { AnimatedTabsContent, Tabs } from '@/components/ui/tabs'
import { ModuleFilterParams } from '@/types/filters'
import ModulesList from '../modules-list'
import { fetchModules } from '@/actions/modules'
import ModuleFlowDiagram from './sankey-modules'

export async function ModulesTab(props: ModuleFilterParams) {
  const activeTab = props.layout
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchModules({ ...props, page })))
  const allModules = results.flatMap((result) => result?.data || [])
  const hasNextPage = results[results.length - 1]?.hasNextPage || false
  return (
    <div className="flex w-full  items-center">
      <Tabs value={activeTab || 'grid'}>
        <AnimatedTabsContent value="grid">
          <ModulesList modules={allModules} currentPage={currentPage} hasNextPage={hasNextPage} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="sankey">
          <ModuleFlowDiagram modules={allModules} />
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
