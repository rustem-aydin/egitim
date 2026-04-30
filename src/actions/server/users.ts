'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

import type { Team, User } from '@/payload-types'
import { UsersFilterParams } from '@/types/filters'
export const getAllUsers = async (): Promise<User[]> => {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    depth: 0,
  })

  return users.docs
}

const PAGE_SIZE = 16

export const fetchUsers = async (
  filters: UsersFilterParams,
): Promise<{ data: any[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })

  // HATA BURADAYDI: +1 eklendiği için veriler boş geliyordu.
  // fetchModules ile birebir aynı mantığa çekildi:
  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  // --- Search ---
  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  // --- Education level ---
  if (filters.education_level) {
    and.push({ education_levels: { equals: filters.education_level } })
  }

  // --- Group (Yeni Nesil Sorgu) ---
  if (filters.group) {
    and.push({
      'group.name': { equals: filters.group },
    })
  }

  // --- Lesson (Yeni Nesil Sorgu) ---
  if (filters.lesson) {
    and.push({
      'lessons.lesson_name': { equals: filters.lesson },
    })
  }

  // --- Team ---
  if (filters.team) {
    const { docs } = await payload.find({
      collection: 'teams',
      where: { name: { equals: filters.team } },
      limit: 1,
      depth: 0,
    })

    const team = docs[0]
    const groupIds = team?.groups

    if (groupIds && Array.isArray(groupIds) && groupIds.length > 0) {
      and.push({ group: { in: groupIds } })
    } else {
      and.push({ id: { equals: -1 } })
    }
  }

  // --- Required but NOT completed modules ---
  if (filters.requiredButNotCompletedModules) {
    const moduleCodes = filters.requiredButNotCompletedModules.split(',')

    and.push({
      'group.modules.code': { in: moduleCodes },
      'lessons.module.code': { not_in: moduleCodes },
    })
  }

  // --- Completed modules ---
  if (filters.completedModules) {
    const moduleCodes = filters.completedModules.split(',')

    and.push({
      'lessons.module.code': { in: moduleCodes },
    })
  }

  // --- Incomplete modules ---
  if (filters.inCompletedModules) {
    const moduleCodes = filters.inCompletedModules.split(',')

    and.push({
      'lessons.module.code': { not_in: moduleCodes },
    })
  }

  let sortField: string | undefined = '-createdAt'
  if (filters.sort) {
    const [field, direction] = filters.sort.split('-')
    sortField = direction === 'desc' ? `-${field}` : field
  }

  const result = await payload.find({
    collection: 'users',
    where: and.length > 0 ? { and } : {},
    page,
    ...(filters.limit === 'Hepsi'
      ? {}
      : {
          limit: filters.limit ? Number(filters.limit) : 12,
        }),
    sort: sortField,
    depth: 2,
    overrideAccess: true,
  })

  return {
    data: result.docs,
    hasNextPage: result.hasNextPage,
    nextCursor: result.hasNextPage ? page + 1 : undefined,
  }
}

export const getUserById = async (id: string): Promise<User> => {
  const payload = await getPayload({ config })

  const user = await payload.find({
    collection: 'users',
    where: { id: { equals: id } },
    limit: 1,
    depth: 3,
  })

  return user.docs[0]
}

export const getUserByIds = async (ids: number[]): Promise<User[]> => {
  const payload = await getPayload({ config })

  const user = await payload.find({
    collection: 'users',
    where: { id: { in: ids } },
    depth: 3,
  })

  return user.docs
}
