import { AnimatedTabsContent, Tabs } from '@/components/ui/tabs'
import { UsersFilterParams } from '@/types/filters'
import UsersList from '../users-list'
import NotCompletedModulesUsersList from './user-modules/list'
import { fetchUsers } from '@/actions/users'
import { TopLessonsCompleters } from './charts/topLessonsCompleters'
import { UserModuleChart } from './charts/user-module-progress-chart'

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
        <AnimatedTabsContent value="topLessonsCompleters">
          <TopLessonsCompleters users={allUsers} />
        </AnimatedTabsContent>
        <AnimatedTabsContent value="moduleProgressChart">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {allUsers.map((user) => (
              <UserModuleChart key={user.id} user={user} />
            ))}
          </div>
        </AnimatedTabsContent>
      </Tabs>
    </div>
  )
}
