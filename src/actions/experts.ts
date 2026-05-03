'use server'
import { getPayload, Sort, Where } from 'payload'
import config from '@payload-config'
import { ExpertFilterParams } from '@/types/filters'
import { Expert } from '@/payload-types'

export const fetchExperts = async (filters: ExpertFilterParams) => {
  const payload = await getPayload({ config })

  const page = filters.page || 1
  const and: Where[] = []
  let sort: Sort = '-date_from'

  if (filters.search) and.push({ name: { like: filters.search } })

  if (filters.modules) {
    and.push({ 'modules.name': { equals: filters.modules } })
  }
  if (filters.lesson) {
    and.push({ 'modules.lessons.name': { equals: filters.lesson } })
  }
  if (filters.team) {
    and.push({ 'teams.name': { equals: filters.team } })
  }
  if (filters.group) {
    and.push({ 'groups.name': { equals: filters.group } })
  }
  if (filters.user) {
    and.push({ 'groups.users.name': { equals: filters.user } })
  }
  // if (filters.group) {
  //   // 1. Group'u bul ve parentModules ID'lerini al
  //   const groupResult = await payload.find({
  //     collection: 'groups',
  //     where: { name: { equals: filters.group } },
  //     limit: 1,
  //   })

  //   const parentModuleIds =
  //     groupResult?.docs[0]?.parentModules?.map((m: any) => {
  //       if (typeof m === 'object' && m !== null) return m.id || m
  //       return m
  //     }) || []

  //   if (parentModuleIds.length === 0) {
  //     and.push({ id: { equals: -1 } })
  //   } else {
  //     // 2. TÜM parentModules'ları al (limit: 1 kaldır!)
  //     const parentModulesResult = await payload.find({
  //       collection: 'parentModules',
  //       where: {
  //         id: {
  //           in: parentModuleIds,
  //         },
  //       },
  //       limit: 100, // veya parentModuleIds.length
  //     })

  //     // 3. Tüm parentModules'lardaki modules ID'lerini topla
  //     const moduleIds: string[] = []
  //     parentModulesResult.docs.forEach((pm: any) => {
  //       const mods =
  //         pm?.modules?.map((m: any) => {
  //           if (typeof m === 'object' && m !== null) return m.id?.toString?.() || m.toString()
  //           return m.toString()
  //         }) || []
  //       moduleIds.push(...mods)
  //     })

  //     if (moduleIds.length === 0) {
  //       and.push({ id: { equals: -1 } })
  //     } else {
  //       and.push({
  //         id: {
  //           in: moduleIds,
  //         },
  //       })
  //     }
  //   }
  // }
  if (filters.sort) {
    const sortValue = String(filters.sort)
    const isAsc = sortValue.startsWith('-')

    const sortPrefix = isAsc ? '+' : '-'

    const field = isAsc ? sortValue.substring(1) : sortValue

    if (field === 'level') {
      sort = `${sortPrefix}parent-module.code`
    } else {
      sort = `${sortPrefix}${field}`
    }
  }

  const result = await payload.find({
    collection: 'experts',
    where: and.length > 0 ? { and } : {},
    sort: sort || '-date_from',
    page,
    ...(filters.limit === 'Hepsi'
      ? {}
      : {
          limit: filters.limit ? Number(filters.limit) : 12,
        }),
    depth: 2,
    overrideAccess: true,
  })

  return {
    data: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    nextPage: result.hasNextPage ? page + 1 : undefined,
  }
}

export const getAllExperts = async (depth: number = 3): Promise<Expert[]> => {
  const payload = await getPayload({ config })

  const teams = await payload.find({
    collection: 'experts',
    depth: depth,
  })

  return teams.docs
}
