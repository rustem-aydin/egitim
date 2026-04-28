import { getTeamById } from '@/actions/server/teams'
import { getUserById } from '@/actions/server/users'
import { TeamDetails } from '@/components/teams/team-details'
import UserDetails from '@/components/users/user-details'
import { get } from 'http'
import { notFound } from 'next/navigation'

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
