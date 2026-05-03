import { getGroupById } from '@/actions/groups'
import GroupDetails from '@/components/pages/groups/group-details'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: number }>
}

const GroupDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const group = await getGroupById(String(id))

  if (isNaN(id)) {
    notFound()
  }
  return <GroupDetails group={group} />
}

export default GroupDetailsPage
