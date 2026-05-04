import { User } from '@/payload-types'
import { NotFoundItem } from '@/components/not-found-item'
import LoadMoreButton from '@/components/load-more-button'
import { UsersCard } from './user-modules'

const NotCompletedModulesUsersList = async ({
  users,
  currentPage,
  hasNextPage,
}: {
  users: User[]
  currentPage?: number
  hasNextPage?: boolean
}) => {
  if (!users.length && currentPage === 1) {
    return <NotFoundItem title="Ders Bulunamadı" description="" />
  }
  return (
    <div className="mx-auto relative z-10">
      {!users.length && <NotFoundItem title="Personel Bulunamadı" description="" />}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 pt-4 gap-4">
        {users?.map((user: any) => {
          return <UsersCard key={user.id} user={user} />
        })}
      </div>

      {hasNextPage && currentPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default NotCompletedModulesUsersList
