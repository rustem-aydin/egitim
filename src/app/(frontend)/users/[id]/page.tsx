import { getUserById } from '@/actions/users'
import MainDetails from '@/components/pages/users/details/main'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: number }>
}

const UserDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const user = await getUserById(String(id))

  if (isNaN(id)) {
    notFound()
  }
  return <MainDetails user={user} />
}

export default UserDetailsPage
