import { NotFoundItem } from '@/components/not-found-item'
import { ModuleCard } from './module-card'
import LoadMoreButton from '@/components/load-more-button'
import { Module } from '@/payload-types'

const ModulesList = async ({
  modules,
  currentPage,
  hasNextPage,
}: {
  modules: Module[]
  currentPage?: number
  hasNextPage?: boolean
}) => {
  return (
    <div className="mx-auto relative z-10">
      {!modules.length && <NotFoundItem title="Modül Bulunamadı" description="" />}
      <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 xl:grid-cols-4  gap-4">
        {modules.map((module) => {
          return <ModuleCard key={module.id} module={module} />
        })}
      </div>
      {hasNextPage && currentPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default ModulesList
