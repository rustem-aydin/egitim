import { NotFoundItem } from '../not-found-item'
import LoadMoreButton from '../load-more-button'
import { UsersFilterParams } from '@/types/filters'
import { fetchUsers } from '@/actions/server/users'
import { UsersCard } from './user-card'

const UsersList = async (props: UsersFilterParams) => {
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchUsers({ ...props, page })))

  const allUsers = results.flatMap((result) => result?.data || [])
  return (
    <div className="mx-auto relative z-10">
      {!allUsers.length && <NotFoundItem title="Personel Bulunamadı" description="" />}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 pt-2 gap-6">
        {allUsers?.map((user: any) => {
          return <UsersCard key={user.id} user={user} />
        })}
      </div>

      {results[0].hasNextPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default UsersList
