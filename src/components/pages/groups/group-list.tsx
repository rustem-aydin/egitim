import { fetchGroups } from '@/actions/groups'
import { NotFoundItem } from '@/components/not-found-item'
import { GroupsFilterParams } from '@/types/filters'
import LoadMoreButton from '../../load-more-button'
import GroupsCard from './group-card'

const GroupsList = async (props: GroupsFilterParams) => {
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchGroups({ ...props, page })))
  const allGroups = results.flatMap((result) => result?.data || [])
  return (
    <div className="mx-auto relative z-10">
      {!allGroups?.length && <NotFoundItem title="Kadro Bulunamadı" description="" />}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 pt-4 gap-4">
        {allGroups?.map((group: any) => {
          return <GroupsCard key={group?.id} group={group} />
        })}
      </div>

      {results[0].hasNextPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default GroupsList
