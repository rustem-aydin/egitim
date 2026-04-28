'use server'
import { getPayload, Where } from 'payload'
import config from '@payload-config'
import { Module, User } from '@/payload-types'
import { ModuleFilterParams } from '@/types/filters'

export const getAllModules = async (): Promise<Module[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'modules',
    depth: 0,
  })

  return cats.docs // ✅ sadece array'i döndür
}

const PAGE_SIZE = 12

export const fetchModules = async (
  filters: ModuleFilterParams,
): Promise<{ data: any[]; nextCursor: number | undefined; hasNextPage: boolean }> => {
  const payload = await getPayload({ config })
  const page = filters.page ? Number(filters.page) : 1

  const and: Where[] = []

  // --- Search ---
  if (filters.search) {
    and.push({ name: { like: filters.search } })
  }

  // --- Level ---
  if (filters.level) {
    const levelMap: Record<string, string> = { Başlangıç: 'A', Orta: 'B', İleri: 'C' }
    const letter = levelMap[filters.level]
    if (letter) and.push({ code: { contains: letter } })
  }

  // --- Teams (Yeni Nesil Sorgu) ---
  if (filters.team) {
    and.push({
      'teams.name': { equals: filters.team },
    })
  }
  // --- Group (Yeni Nesil Sorgu) ---
  if (filters.group) {
    // Group ismiyle filtrelemek istiyorsan nested path kullanabilirsin
    and.push({
      'groups.name': { equals: filters.group },
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
    depth: 1, // Join fieldlar zaten gerekli veriyi getirecek
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
