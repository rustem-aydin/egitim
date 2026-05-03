// components/lessons/lessons-list.tsx

import { NotFoundItem } from '@/components/not-found-item'
import { Expert } from '@/payload-types'
import LoadMoreButton from '@/components/load-more-button'
import ExpertCard from '../../expert-card'

const ExpertsList = async ({
  experts,
  currentPage,
  hasNextPage,
}: {
  experts: Expert[]
  currentPage?: number
  hasNextPage?: boolean
}) => {
  if (!experts.length && currentPage === 1) {
    return <NotFoundItem title="Ders Bulunamadı" description="" />
  }
  return (
    <div className=" relative z-10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 pt-4 gap-6">
        {experts.map((expert: Expert) => (
          <ExpertCard expert={expert} key={expert.id} />
        ))}
      </div>
      {hasNextPage && currentPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default ExpertsList
