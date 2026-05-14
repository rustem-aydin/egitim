import { getTeamById } from '@/actions/teams'
import MainDetails from '@/components/pages/teams/details/main'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: number }>
}

const TeamDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const team = await getTeamById(id)
  if (isNaN(id)) {
    notFound()
  }
  return <MainDetails team={team} />
}

export default TeamDetailsPage
