import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@/payload-types'
import { MiniUsersCard } from '../users/mini-users-card'

export const LessonCompletedUser = ({ users }: { users: (number | User)[] | null }) => {
  return (
    <>
      {users && users.length > 0 && (
        <div className="group relative  h-full transform shadow-2xl rounded-2xl transition-all duration-500">
          <Card className="h-full border">
            <CardHeader className=" relative">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-linear-to-b from-primary to-primary/40" />
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {'Tamamlayan Personeller'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {users.map((user: any) => (
                <MiniUsersCard key={user?.id} user={user} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default LessonCompletedUser
