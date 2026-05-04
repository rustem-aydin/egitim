import { getTeamById } from '@/actions/teams'
import { TeamDetails } from '@/components/pages/teams/team-details'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: number }>
}

const TeamDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const team = await getTeamById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <TeamDetails team={team} />
}

export default TeamDetailsPage
