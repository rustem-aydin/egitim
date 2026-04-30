import { getUserById } from '@/actions/server/users'
import UserDetails from '@/components/pages/users/user-details'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: number }>
}

const UserDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const user = await getUserById(String(id))

  if (isNaN(id)) {
    notFound()
  }
  return <UserDetails user={user} />
}

export default UserDetailsPage
