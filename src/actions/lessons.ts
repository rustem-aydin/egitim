'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { IEvent } from '@/types/interfaces'
import { TEventColor } from '@/types/types'
import { Lesson, Module, Team } from '@/payload-types'
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

export const getAllLessons = async (depth: number = 0): Promise<Lesson[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'lessons',
    depth: depth,
  })
  return cats.docs
}

export const fetchLessons = async (filters: LessonFilterParams) => {
  const payload = await getPayload({ config })

  const page = filters.page || 1
  const and: Where[] = []
  let sort: Sort = '-date_from'

  if (filters.search?.trim()) {
    const searchTerm = filters.search.trim()
    and.push({
      or: [
        { name: { like: searchTerm } },
        { description: { like: searchTerm } },
        { instructor: { like: searchTerm } },
      ],
    })
  }

  // ─── KATEGORİ ───
  if (filters.category) {
    if (typeof filters.category === 'number' || /^\d+$/.test(String(filters.category))) {
      and.push({ category: { equals: Number(filters.category) } })
    } else {
      and.push({ 'category.name': { equals: filters.category } })
    }
  }

  // ─── LOKASYON ───
  if (filters.location) {
    if (typeof filters.location === 'number' || /^\d+$/.test(String(filters.location))) {
      and.push({ location: { equals: Number(filters.location) } })
    } else {
      and.push({ 'location.name': { equals: filters.location } })
    }
  }

  // ─── TARİH ───
  if (filters.dateFrom) {
    and.push({ date_from: { greater_than_equal: new Date(filters.dateFrom).toISOString() } })
  }
  if (filters.dateTo) {
    and.push({ date_from: { less_than_equal: new Date(filters.dateTo).toISOString() } })
  }

  if (filters.status) {
    and.push({ status: { equals: filters.status } })
  }

  if (filters.by_generate) {
    if (typeof filters.by_generate === 'number' || /^\d+$/.test(String(filters.by_generate))) {
      and.push({ by_generate: { equals: Number(filters.by_generate) } })
    } else {
      and.push({ 'by_generate.name': { equals: filters.by_generate } })
    }
  }

  if (filters.level) {
    const levelMap: Record<string, string> = { Başlangıç: 'A', Orta: 'B', İleri: 'C' }
    const letter = levelMap[filters.level]
    if (letter) and.push({ 'module.code': { contains: letter } })
  }

  // ─── MODÜL ID (moduleIds ile ayrı parametre) ───
  if (filters.modules) {
    and.push({ module: { equals: filters.modules } })
  }

  if (filters.group) {
    const groupModules = await payload.find({
      collection: 'modules',
      where: { 'groups.name': { equals: filters.group } },
      depth: 0,
      limit: 1000,
      pagination: false,
    })
    const moduleIds = groupModules.docs.map((m) => m.id)

    if (moduleIds.length === 0) {
      return { data: [], totalDocs: 0, totalPages: 0, hasNextPage: false, nextPage: undefined }
    }
    and.push({ module: { in: moduleIds } })
  }

  if (filters.team) {
    const teamModules = await payload.find({
      collection: 'modules',
      where: { 'teams.name': { equals: filters.team } },
      depth: 0,
      limit: 1000,
      pagination: false,
    })
    const moduleIds = teamModules.docs.map((m) => m.id)

    and.push({ module: { in: moduleIds } })
  }

  if (filters.user) {
    const userIds = filters.user.split(',').map((id) => id.trim())
    if (userIds.length === 1) {
      and.push({ 'users.id': { equals: Number(userIds[0]) } })
    } else {
      and.push({ 'users.id': { in: userIds.map(Number) } })
    }
  }

  if (filters.sort) {
    const sortValue = String(filters.sort)
    const isDesc = sortValue.startsWith('-')
    const sortPrefix = isDesc ? '-' : ''
    const field = isDesc ? sortValue.substring(1) : sortValue

    const sortFieldMap: Record<string, string> = {
      name: 'name',
      description: 'description',
      status: 'status',
      students: 'students',
      duration: 'duration',
      instructor: 'instructor',
      rating: 'rating',
      date_from: 'date_from',
      date_to: 'date_to',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      category: 'category',
      location: 'location',
      module: 'module',
      by_generate: 'by_generate',
      level: 'module',
    }

    sort = `${sortPrefix}${sortFieldMap[field] || field}`
  }

  // ─── LİMİT ───
  const limit = filters.limit === 'Hepsi' ? undefined : filters.limit ? Number(filters.limit) : 12

  // ─── SORGUYU ÇALIŞTIR ───
  const result = await payload.find({
    collection: 'lessons',
    where: and.length > 0 ? { and } : {},
    sort: sort || '-date_from',
    page,
    ...(limit !== undefined ? { limit } : {}),
    depth: 3,
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

export const getLessonById = async (id: number): Promise<Lesson> => {
  const payload = await getPayload({ config })

  const drill = await payload.find({
    collection: 'lessons',
    where: { id: { equals: id } },
    limit: 1,
    depth: 3,
  })

  return drill.docs[0] // ✅ sadece ilk kaydı döndür
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
