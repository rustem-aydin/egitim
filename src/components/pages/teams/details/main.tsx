'use server'
import Fallback from '@/components/fallback'
import { Module, Team } from '@/payload-types'

import { getAllTeams } from '@/actions/teams'
import TeamsDropdownList from '../team-dropdown-list'
import { TeamDetails } from '../team-details'
import TeamModules from './team-modules'
import TeamUsers from './team-users'

export const MainDetails = async ({ team }: { team: Team }) => {
  const teams = await getAllTeams(0)
  console.log(JSON.stringify(team, null, 2))
  const allUsers = team.groups?.docs?.flatMap((group: any) => group.users.docs) ?? []
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="sticky top-0 z-50 pt-2 backdrop-blur-md bg-background/80">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Fallback />
          </div>
          <div className="col-span-6 flex justify-end">
            <TeamsDropdownList teams={teams} />
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        {/* Sol taraf - 8/12 */}
        <div className="col-span-8 flex flex-col gap-4">
          {/* Üst: TeamDetails */}
          <div className="col-span-12">
            <TeamDetails team={team} />
          </div>

          {/* Alt: İki eşit sütun (her biri 6/12 = yarım) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TeamModules modules={team.modules as Module[]} />
            </div>
            <div>
              <TeamModules modules={team.modules as Module[]} />
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <TeamUsers users={allUsers} />
        </div>
      </div>
    </div>
  )
}

export default MainDetails
