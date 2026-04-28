'use server'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import { Group } from '@/payload-types'
import { GroupsFilterParams } from '@/types/filters'

export const getAllGroups = async (): Promise<Group[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'groups',
    depth: 0,
  })

  return cats.docs // ✅ sadece array'i döndür
}
export const getGroupById = async (id: string): Promise<Group> => {
  const payload = await getPayload({ config })

  const group = await payload.find({
    collection: 'groups',
    where: { id: { equals: id } },
    limit: 1,
    depth: 3,
  })

  return group.docs[0]
}

export const fetchGroups = async (
  filters: GroupsFilterParams,
): Promise<{ data: Group[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })

  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  // --- Search ---
  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  // --- Group (exact name match) ---

  if (filters.team) {
    and.push({ name: { equals: filters.team } })
  }

  // --- Lesson (lesson_name üzerinden grup bul) ---
  if (filters.lesson) {
    and.push({
      'modules.lessons.lesson_name': { equals: filters.lesson },
    })
  }

  // --- Modules (code üzerinden grup bul) ---
  if (filters.modules) {
    const moduleCodes = filters.modules.split(',')

    and.push({
      'modules.code': { in: moduleCodes },
    })
  }

  // --- Sort ---
  let sortField: string | undefined = '-createdAt'
  if (filters.sort) {
    const [field, direction] = filters.sort.split('-')
    sortField = direction === 'desc' ? `-${field}` : field
  }

  // --- Execute ---
  const result = await payload.find({
    collection: 'groups',
    where: and.length > 0 ? { and } : {},
    ...(filters.limit === 'Hepsi'
      ? {}
      : {
          limit: filters.limit ? Number(filters.limit) : 12,
        }),
    sort: sortField,
    depth: 1,
    overrideAccess: true,
  })

  return {
    data: result.docs as Group[],
    hasNextPage: result.hasNextPage,
    nextCursor: result.hasNextPage ? page + 1 : undefined,
  }
}
