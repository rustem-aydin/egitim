import { TeamsFilterParams } from '@/types/filters'
import { fetchTeams } from '@/actions/teams'
import { TeamCard } from './team-card'
import { NotFoundItem } from '../../not-found-item'
import LoadMoreButton from '../../load-more-button'

const TeamList = async (props: TeamsFilterParams) => {
  const currentPage = props.page ? Number(props.page) : 1
  const pages = Array.from({ length: currentPage }, (_, i) => i + 1)
  const results = await Promise.all(pages.map((page) => fetchTeams({ ...props, page })))

  const allTeams = results.flatMap((result) => result?.data || [])
  return (
    <div className="mx-auto relative z-10">
      {!allTeams?.length && <NotFoundItem title="Takım Bulunamadı" description="" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 items-stretch">
        {allTeams?.map((team: any) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
      {results[0].hasNextPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default TeamList
