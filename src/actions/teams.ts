'use server'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import type { Team } from '@/payload-types'
import { TeamsFilterParams } from '@/types/filters'
export const getAllTeamsDepth0 = async (): Promise<Team[]> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'teams',
    depth: 0,
  })

  return teams.docs
}

export const getAllTeams = async (depth: number = 0): Promise<Team[]> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'teams',
    depth: depth,
  })

  return teams.docs
}

// export const getTeamByGroupId = async (id: number): Promise<Team> => {
//   const payload = await getPayload({ config })

//   const team = await payload.find({
//     collection: 'teams',
//     where: { 'groups.id': { equals: id } },
//     limit: 1,
//     depth: 1,
//   })

//   return team.docs[0]
// }

export const fetchTeams = async (
  filters: TeamsFilterParams,
): Promise<{ data: any[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })

  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  // --- Search ---
  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  // --- Modules ---
  if (filters.modules) {
    and.push({ 'modules.name': { equals: filters.modules } })
  }
  if (filters.lesson) {
    and.push({ 'modules.lessons.name': { equals: filters.lesson } })
  }
  if (filters.user) {
    and.push({ 'groups.users.name': { equals: filters.user } })
  }
  if (filters.group) {
    and.push({ 'groups.name': { equals: filters.group } })
  }

  // --- Sort ---
  let sortField: string | undefined = '-createdAt'
  if (filters.sort) {
    const [field, direction] = filters.sort.split('-')
    sortField = direction === 'desc' ? `-${field}` : field
  }

  const result = await payload.find({
    collection: 'teams',
    where: and.length > 0 ? { and } : {},
    page,
    ...(filters.limit === 'Hepsi'
      ? {}
      : {
          limit: filters.limit ? Number(filters.limit) : 12,
        }),
    sort: sortField,
    depth: 3,
    overrideAccess: true,
  })

  return {
    data: result.docs,
    hasNextPage: result.hasNextPage,
    nextCursor: result.hasNextPage ? page + 1 : undefined,
  }
}

export const getTeamById = async (id: number): Promise<Team> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'teams',
    where: { id: { equals: id } },
    limit: 1,
    depth: 3,
  })

  return teams.docs[0]
}

export const getTeamByIds = async (id: string): Promise<Team[]> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'teams',
    where: { id: { in: id } },
    limit: 1,
    depth: 3,
  })

  return teams.docs
}

export const getTeamsByExpertIds = async (expertIds: number[]): Promise<Team[]> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'teams',
    where: {
      experts: {
        in: expertIds,
      },
    },
    depth: 0,
  })

  return teams.docs
}
