import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { User } from '@/payload-types'
import { ExternalLinkIcon, Users } from 'lucide-react'
import Link from 'next/link'

export const DrillCompletedUser = ({ users }: { users: (number | User)[] | null }) => {
  return (
    <>
      {users && users.length > 0 && (
        <div className="group relative  min-h-full transform shadow-2xl rounded-2xl transition-all duration-500">
          <Card className="h-full border">
            <CardHeader className=" relative">
              <div className="flex items-center gap-2">
                <Users size={18} />{' '}
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {'Tamamlayan Personeller'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {users.map((user: any) => (
                <Item variant="outline" asChild>
                  <Link href={'/users/' + user?.id} target="_blank" rel="noopener noreferrer">
                    <ItemContent>
                      <ItemTitle>{user?.name}</ItemTitle>
                      <ItemDescription>{user?.rank}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ExternalLinkIcon className="size-4" />
                    </ItemActions>
                  </Link>
                </Item>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default DrillCompletedUser
