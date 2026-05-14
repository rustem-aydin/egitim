import { Card, CardTitle } from '@/components/ui/card'
import { User } from '@/payload-types'
import { Building } from 'lucide-react'
import { MiniUsersCard } from '../../users/mini-users-card'

const TeamUsers = ({ users }: { users: User[] }) => {
  console.log(JSON.stringify(users, null, 2))
  return (
    <Card className="px-4 h-full">
      <CardTitle className="font-semibold mb-4 flex items-center gap-2">
        <Building className="h-5 w-5 text-muted-foreground" />
        Takıma Dahil Personeller ({users?.length})
      </CardTitle>
      <div className="space-y-2 flex flex-col pr-2 rounded-md border p-2">
        {users.length > 0 ? users.map((user: any) => <MiniUsersCard user={user} />) : <p>de</p>}
      </div>
    </Card>
  )
}

export default TeamUsers
