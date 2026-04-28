// utils/payload/server/drills.ts
'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Drill, DrillGroup, DrillCategory } from '@/payload-types'

export type GroupedDrills = Record<string, Drill[]>

export interface FetchDrillsParams {
  search?: string
  sort?: string
  drill_category?: string
  user?: string
}

// actions/server/drills.ts

export async function fetchDrills({
  search = '',
  sort = '',
  user = '',
  drill_category = '',
}: FetchDrillsParams): Promise<GroupedDrills> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'drills',
    where: buildWhereClause({ search, user, drill_category }),
    sort: buildSortParam(sort),
    limit: 1000,
    depth: 2,
  })

  const grouped: GroupedDrills = {}

  for (const drill of result.docs as Drill[]) {
    const group = drill.group as DrillGroup | null
    const category = group?.category as DrillCategory | null

    const groupName = group?.name ?? 'Diğer'
    const categoryName = category?.name ?? 'Bilinmeyen'
    const key = `${groupName} (${categoryName})`

    grouped[key] ??= []
    grouped[key].push(drill)
  }

  return grouped
}

function buildWhereClause(params: FetchDrillsParams) {
  const { search, user, drill_category } = params
  const andConditions: any[] = []

  if (search) {
    andConditions.push({
      or: [
        { name: { like: search } },
        { description: { like: search } },
        { location: { like: search } },
      ],
    })
  }

  if (user) {
    // participants içinde user.name veya user.email arama
    andConditions.push({
      or: [{ 'participants.name': { like: user } }],
    })
  }

  if (drill_category) {
    andConditions.push({
      'group.category.name': { equals: drill_category },
    })
  }

  return andConditions.length === 0
    ? {}
    : andConditions.length === 1
      ? andConditions[0]
      : { and: andConditions }
}

function buildSortParam(sort: string): string {
  if (!sort) return '-createdAt'
  const [field, direction] = sort.split('-')
  const payloadField = field === 'created_at' ? 'createdAt' : field
  return direction === 'desc' ? `-${payloadField}` : payloadField
}

export const getAllDrillCategories = async (): Promise<DrillCategory[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'drill-categories',
    depth: 0,
  })

  return cats.docs // ✅ sadece array'i döndür
}

export const getDrillById = async (id: string): Promise<Drill> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'drills',
    where: { id: { equals: id } },
    limit: 1,
    depth: 2,
  })

  return drill.docs[0] // ✅ sadece ilk kaydı döndür
}

export const getAllDrills = async (): Promise<Drill[]> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'drills',
    depth: 2,
  })

  return drill.docs
}
