'use server'
import Fallback from '@/components/fallback'
import UsersDropdownList from './users-dropdown-list'
import { getAllUsers } from '@/actions/users'
import UserDetails from './user-details'
import { User } from '@/payload-types'
import UserCompletersLessons from './users-completers-lessons'
import { UserModuleChart } from '../layouts/charts/user-module-progress-chart'
import UserModulesDetails from './user-modules-details'

export const MainDetails = async ({ user }: { user: User }) => {
  const users = await getAllUsers(0)
  return (
    <div className="mx-auto w-full max-w-6xl ">
      <div className="sticky top-0 z-50 pt-2  backdrop-blur-md bg-background/80">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Fallback />
          </div>
          <div className="col-span-6 flex justify-end">
            <UsersDropdownList users={users} />
          </div>
        </div>
      </div>

      {/* İçerik - Header'ın altından başlar */}
      <div className="grid grid-cols-12 gap-4 items-stretch ">
        <div className="col-span-8">
          <UserDetails user={user} />
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <div className="shrink-0">
            <UserModuleChart isTitle={false} user={user} />
          </div>

          <div className="flex-1">
            <UserCompletersLessons user={user} />
          </div>
        </div>
        <div className="col-span-8 flex flex-col gap-4">
          <UserModulesDetails user={user} />
        </div>
      </div>
    </div>
  )
}

export default MainDetails
