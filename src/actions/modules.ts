'use server'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import { Module, User } from '@/payload-types'
import { ModuleFilterParams } from '@/types/filters'

export const getAllModules = async (depth: number = 0): Promise<Module[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'modules',
    depth: depth,
  })

  return cats.docs // ✅ sadece array'i döndür
}

export const fetchModules = async (
  filters: ModuleFilterParams,
): Promise<{ data: any[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })
  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  if (filters.level) {
    const levelMap: Record<string, string> = { Başlangıç: 'A', Orta: 'B', İleri: 'C' }
    const letter = levelMap[filters.level]
    if (letter) and.push({ code: { contains: letter } })
  }

  if (filters.team) {
    and.push({ 'teams.name': { equals: filters.team } })
  }
  if (filters.expert) {
    and.push({ 'experts.name': { equals: filters.expert } })
  }
  if (filters.group) {
    and.push({ 'groups.name': { equals: filters.group } })
  }
  if (filters.lesson) {
    // Group ismiyle filtrelemek istiyorsan nested path kullanabilirsin
    and.push({
      'lessons.name': { equals: filters.lesson },
    })
  }

  const result = await payload.find({
    collection: 'modules',
    ...(filters.limit === 'Hepsi'
      ? {}
      : {
          limit: filters.limit ? Number(filters.limit) : 12,
        }),
    page,
    sort: filters.sort
      ? filters.sort.includes('-asc')
        ? filters.sort.split('-')[0]
        : `-${filters.sort.split('-')[0]}`
      : '-createdAt',
    where: { and },
    depth: 3,

    overrideAccess: true,
  })

  return {
    data: result.docs,
    hasNextPage: result.hasNextPage,
    nextCursor: result.hasNextPage ? page + 1 : undefined,
  }
}

export const getModuleById = async (id: string): Promise<Module> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'modules',
    where: { id: { equals: id } },
    limit: 1,
    depth: 3,
  })

  return drill.docs[0]
}

export const getUsersWhoTookModule = async (moduleId: number) => {
  const payload = await getPayload({ config })

  // 1. Modülü ve derslerini çek
  const moduleRes = await payload.findByID({
    collection: 'modules',
    id: moduleId,
    depth: 1,
    overrideAccess: true,
  })
  // 2. Modüle ait ders ID'lerini al
  const lessonIds =
    moduleRes.lessons?.docs?.map((l: any) => (typeof l === 'object' ? l.id : l)) || []

  if (lessonIds.length === 0) return []

  // 3. Bu derslerden HERHANGİ BİRİNİ alan kullanıcıları getir
  const usersRes = await payload.find({
    collection: 'users',
    where: {
      lessons: {
        in: lessonIds, // ← en az 1 dersi almış olması yeterli
      },
    },
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })

  return usersRes.docs
}

export const getModuleByIds = async (ids: number[]): Promise<Module> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'modules',
    where: { id: { in: ids } },
    limit: 1,
    depth: 3,
  })

  return drill.docs[0]
}
