import { NotFoundItem } from '@/components/not-found-item'
import { ModuleFilterParams } from '@/types/filters'
import { fetchModules } from '@/actions/modules'
import { ModuleCard } from './module-card'
import LoadMoreButton from '@/components/load-more-button'

const ModulesList = async (props: ModuleFilterParams) => {
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchModules({ ...props, page })))

  const allModules = results.flatMap((result) => result?.data || [])
  const hasNextPage = results[results.length - 1]?.hasNextPage || false
  return (
    <div className="mx-auto relative z-10">
      {!allModules.length && <NotFoundItem title="Modül Bulunamadı" description="" />}
      <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 xl:grid-cols-4  gap-4">
        {allModules.map((module) => {
          return <ModuleCard key={module.id} module={module} />
        })}
      </div>
      {hasNextPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default ModulesList
