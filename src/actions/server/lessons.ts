'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { IEvent } from '@/types/interfaces'
import { TEventColor } from '@/types/types'
import { Lesson } from '@/payload-types'
import type { Sort, Where } from 'payload'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { LessonFilterParams } from '@/types/filters'
import configPromise from '@payload-config'

export async function getAllLessonsAction(): Promise<IEvent[]> {
  try {
    const payload = await getPayload({ config })

    // Lessons verilerini al
    const lessonsResult = await payload.find({
      collection: 'lessons',
      limit: 0, // 0 = tüm kayıtlar
      select: {
        id: true,
        lesson_name: true,
        lesson_description: true,
        date_from: true,
        date_to: true,
        instructor: true,
        category: true,
        created_at: true, // ← EKLEYİN
      },
    })

    // Drills verilerini al
    const drillsResult = await payload.find({
      collection: 'drills',
      limit: 0,
      select: {
        id: true,
        name: true,
        description: true,
        date_from: true,
        date_to: true,
        group_id: true,
      },
    })

    const lessons = lessonsResult.docs
    const drills = drillsResult.docs
    const events: IEvent[] = []

    // Lessons verilerini işle
    if (lessons && lessons.length > 0) {
      const lessonEvents: IEvent[] = lessons.map((lesson) => {
        // category artık bir relationship objesi olabilir
        const categoryName =
          typeof lesson.category === 'object' && lesson.category !== null
            ? (lesson.category as { name?: string }).name?.toLowerCase()
            : typeof lesson.category === 'string'
              ? String(lesson.category).toLowerCase()
              : ''

        let color: TEventColor = 'blue'
        if (categoryName === 'eğitim') color = 'red'
        if (categoryName === 'online eğitim') color = 'green'
        if (categoryName === 'kurs') color = 'purple'

        const instructorName =
          typeof lesson.instructor === 'string' && lesson.instructor
            ? lesson.instructor
            : 'Atanmamış Eğitmen'

        return {
          id: lesson.id,
          startDate: lesson.date_from ?? new Date().toISOString(),
          endDate: lesson.date_to ?? new Date().toISOString(),
          title: lesson.name ?? 'Başlıksız Ders',
          color,
          description: lesson.description ?? 'Açıklama mevcut değil.',
          user: {
            id: `instructor-${lesson.id}-${instructorName}`,
            name: instructorName,
            picture: '/avatars/default.png',
          },
        }
      })
      events.push(...lessonEvents)
    }

    // Drills verilerini işle
    if (drills && drills.length > 0) {
      const maxLessonId =
        lessons.length > 0 ? Math.max(...lessons.map((lesson) => Number(lesson.id))) : 0

      const drillEvents: IEvent[] = await Promise.all(
        drills.map(async (drill) => {
          // group_id artık relationship objesi olabilir, populate edilmiş halde gelir
          const groupName =
            typeof drill.group === 'object' && drill.group !== null
              ? (drill.group as { name?: string }).name
              : null

          return {
            id: maxLessonId + Number(drill.id) + 10000,
            startDate: drill.date_from ?? new Date().toISOString(),
            endDate: drill.date_to ?? new Date().toISOString(),
            title: drill.name ?? 'Başlıksız Drill',
            color: 'blue' as TEventColor,
            description: drill.description ?? 'Açıklama mevcut değil.',
            user: {
              id: `drill-instructor-${drill.id}`,
              name: groupName ?? 'Drill Eğitmeni',
              picture: '/avatars/drill-default.png',
            },
          }
        }),
      )
      events.push(...drillEvents)
    }

    return events
  } catch (error) {
    console.error('Server Action Error fetching lessons and drills for calendar:', error)
    throw new Error('Could not fetch lessons and drills data for calendar.')
  }
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'lessons',
    depth: 3,
  })

  return cats.docs
}

export const fetchLessons = async (filters: LessonFilterParams) => {
  const payload = await getPayload({ config })

  const page = filters.page || 1
  const and: Where[] = []
  let sort: Sort = '-date_from'

  if (filters.search) and.push({ name: { like: filters.search } })
  if (filters.category) and.push({ 'category.name': { equals: filters.category } })
  if (filters.location) and.push({ 'location.name': { equals: filters.location } })

  if (filters.dateFrom)
    and.push({ date_from: { greater_than_equal: `${filters.dateFrom}T00:00:00.000Z` } })
  if (filters.dateTo)
    and.push({ date_from: { less_than_equal: `${filters.dateTo}T23:59:59.000Z` } })

  if (filters.status) and.push({ status: { equals: filters.status } })

  if (filters.by_generate) and.push({ 'by_generate.name': { equals: filters.by_generate } })

  if (filters.level) {
    const levelMap: Record<string, string> = { Başlangıç: 'A', Orta: 'B', İleri: 'C' }
    const letter = levelMap[filters.level]
    if (letter) and.push({ 'module.code': { contains: letter } })
  }
  if (filters.modules) {
    const codes = filters.modules.split(',').map((c) => c.trim())
    and.push({ 'module.code': { in: codes } })
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

  if (filters.team) {
    const teamNames = filters.team.split(',').map((t) => t.trim())
    const teamsResult = await payload.find({
      collection: 'teams',
      where: { name: { in: teamNames } },
      select: { parentModules: true },
      limit: 1000,
    })
    const teamModuleIds = teamsResult.docs.flatMap(
      (t: any) => t.parentModules?.map((m: any) => (typeof m === 'object' ? m.id : m)) || [],
    )
    const ParentModulesResult = await payload.find({
      collection: 'parentModules',
      where: { id: { in: teamModuleIds } },
      select: { modules: true },
      limit: 1000,
    })
    const moduleIds = ParentModulesResult.docs.flatMap(
      (pm: any) => pm.modules?.docs.map((m: any) => (typeof m === 'object' ? m.id : m)) || [],
    )
    and.push({ module: { in: moduleIds } })
  }

  const result = await payload.find({
    collection: 'lessons',
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
export const getLessonById = async (id: string): Promise<Lesson> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'lessons',
    where: { id: { equals: id } },
    limit: 1,
    depth: 2,
  })

  return drill.docs[0] // ✅ sadece ilk kaydı döndür
}

export const getAllLessonsDepth0 = async (): Promise<Lesson[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'lessons',
    depth: 0,
  })

  return cats.docs
}

export async function onSubmit(values: Lesson) {
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: await headers() })

  const lessons = await payload.create({
    collection: 'lessons',

    data: { ...values, by_generate: user?.user?.id },
  })
  revalidatePath('/lessons')
  return lessons
}

export interface GanttStatus {
  id: string
  name: string
  color: string
}

export interface GanttFeature {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: GanttStatus
  groupName: string
}

export async function getCategoryGanttDataAction(): Promise<GanttFeature[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Payload CMS Local API ile paralel veri çekimi
    const [lessonsResult, drillsResult] = await Promise.all([
      payload.find({
        collection: 'lessons',
        depth: 0,
        limit: 1000,
        select: {
          id: true,
          name: true,
          date_from: true,
          date_to: true,
        },
      }),
      payload.find({
        collection: 'drills',
        depth: 0,
        limit: 1000,
        select: {
          id: true,
          name: true,
          date_from: true,
          date_to: true,
        },
      }),
    ])

    const lessons = lessonsResult.docs
    const drills = drillsResult.docs

    // 2. Dersleri Gantt formatına dönüştür
    const lessonItems: GanttFeature[] = lessons.map((lesson) => {
      const startDate = lesson.date_from ? new Date(lesson.date_from) : new Date()
      const endDate = lesson.date_to ? new Date(lesson.date_to) : startDate

      return {
        id: `lesson-${lesson.id}`,
        name: lesson.name || 'İsimsiz Ders',
        startAt: startDate,
        endAt: endDate,
        status: {
          id: 'egitim',
          name: 'Eğitim',
          color: 'var(--chart-2)',
        },
        groupName: 'Eğitimler',
      }
    })

    // 3. Tatbikatları Gantt formatına dönüştür
    const drillItems: GanttFeature[] = drills.map((drill) => {
      const startDate = drill.date_from ? new Date(drill.date_from) : new Date()
      const endDate = drill.date_to ? new Date(drill.date_to) : startDate

      return {
        id: `drill-${drill.id}`,
        name: drill.name || 'İsimsiz Tatbikat',
        startAt: startDate,
        endAt: endDate,
        status: {
          id: 'tatbikat',
          name: 'Tatbikat',
          color: 'var(--chart-4)',
        },
        groupName: 'Tatbikatlar',
      }
    })

    // 4. İki listeyi birleştir ve tarihe göre sırala (opsiyonel)
    return [...lessonItems, ...drillItems].sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
  } catch (error) {
    console.error('Payload CMS Server Action Error fetching Gantt data:', error)
    throw new Error('Gantt verileri çekilemedi.')
  }
}
