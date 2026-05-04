'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

import type { Module, Team, User } from '@/payload-types'
import { UsersFilterParams } from '@/types/filters'
import { filter } from 'lodash'
import { no } from 'zod/v4/locales'
export const getAllUsers = async (depth: number = 0): Promise<User[]> => {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    depth: depth,
  })

  return users.docs
}

export const fetchUsers = async (
  filters: UsersFilterParams,
): Promise<{ data: any[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })

  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  // --- Search ---
  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  // --- Group (Yeni Nesil Sorgu) ---
  if (filters.group) {
    and.push({
      'group.name': { equals: filters.group },
    })
  }
  if (filters.expert) {
    and.push({
      'group.experts.name': { equals: filters.expert },
    })
  }
  // --- Lesson (Yeni Nesil Sorgu) ---
  if (filters.lesson) {
    and.push({
      'lessons.name': { equals: filters.lesson },
    })
  }

  if (filters.requiredInCompletedModules) {
    const codes = filters.requiredInCompletedModules.split(',').map((c) => c.trim())

    // Sadece uzmanlık filtresini and.push ile ekle
    and.push({
      or: [{ 'group.team.experts.modules.code': { in: codes } }],
    })
  }

  if (filters.team) {
    and.push({
      'group.team.name': { equals: filters.team },
    })
  }

  // --- Required but NOT completed modules ---
  if (filters.completedModule) {
    and.push({
      'lessons.module.name': { equals: filters.completedModule },
    })
  }

  let sortField: string | undefined = '-createdAt'
  if (filters.sort) {
    const [field, direction] = filters.sort.split('-')
    sortField = direction === 'desc' ? `-${field}` : field
  }
  if (filters.education_level) {
    and.push({
      education_levels: { equals: filters.education_level },
    })
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
    depth: 3,
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
