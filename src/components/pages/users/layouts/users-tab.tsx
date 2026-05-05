import { AnimatedTabsContent, Tabs } from '@/components/ui/tabs'
import { UsersFilterParams } from '@/types/filters'
import UsersList from '../users-list'
import NotCompletedModulesUsersList from './user-modules/list'
import { fetchUsers } from '@/actions/users'

export async function UsersTab(props: UsersFilterParams) {
  const activeTab = props.layout
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchUsers({ ...props, page })))
  const allUsers = results.flatMap((result) => result?.data || [])
  const hasNextPage = results[results.length - 1]?.hasNextPage || false
  return (
    <div className="flex w-full  items-center">
      <Tabs value={activeTab || 'grid'}>
        <AnimatedTabsContent value="grid">
          <UsersList users={allUsers} currentPage={currentPage} hasNextPage={hasNextPage} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="modules">
          <NotCompletedModulesUsersList
            users={allUsers}
            currentPage={currentPage}
            hasNextPage={hasNextPage}
          />
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
