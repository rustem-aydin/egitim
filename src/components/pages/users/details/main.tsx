'use server'
import Fallback from '@/components/fallback'
import UsersDropdownList from './users-dropdown-list'
import { getAllUsers } from '@/actions/users'
import UserDetails from './user-details'
import { User } from '@/payload-types'
import UserCompletersLessons from './users-completers-lessons'

export const MainDetails = async ({ user }: { user: User }) => {
  const users = await getAllUsers(0)

  return (
    <div style={{ maxWidth: '72rem', width: '100%', margin: '0 auto', padding: '1rem' }}>
      {/* Üst satır: Fallback ve Dropdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ gridColumn: 'span 6 / span 6' }}>
          <Fallback />
        </div>
        <div style={{ gridColumn: 'span 6 / span 6', display: 'flex', justifyContent: 'flex-end' }}>
          <UsersDropdownList users={users} />
        </div>
      </div>

      {/* Alt satır: İki UserDetails yan yana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
        <div style={{ gridColumn: 'span 8 / span 6' }}>
          <UserDetails user={user} />
        </div>
        <div style={{ gridColumn: 'span 4 / span 6' }}>
          <UserCompletersLessons user={user} />
        </div>
      </div>
    </div>
  )
}

export default MainDetails
