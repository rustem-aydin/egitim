'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { LessonRequest } from '@/payload-types'
import { LessonRequestsValues } from '@/types/schemas'

export const getAllLessonsRequests = async (lesson_id: string): Promise<LessonRequest[]> => {
  const payload = await getPayload({ config })

  const lessonRequests = await payload.find({
    collection: 'lesson-requests',
    where: { lessons: { equals: lesson_id } },
    depth: 2,
  })

  return lessonRequests.docs // ✅ sadece ilk kaydı döndür
}
export async function AddLessonRequest(values: LessonRequestsValues) {
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: await headers() })
  const lessons = await payload.create({
    collection: 'lesson-requests',
    data: {
      description: values?.description,
      lessons: values?.lessons,
      users: user?.user?.id,
    },
  })
  revalidatePath('/lessons')
  return lessons
}

export const isRequest = async (lesson_id: number): Promise<boolean> => {
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: await headers() })

  const lessonRequests = await payload.find({
    collection: 'lesson-requests',
    where: { lessons: { equals: lesson_id }, users: { equals: user?.user?.id } },
    limit: 1,
    depth: 2,
  })
  return lessonRequests.docs.length > 0
}

export const deleteLessonRequest = async (lesson_id: number) => {
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: await headers() })

  const lessonRequests = await payload.delete({
    collection: 'lesson-requests',
    where: { lessons: { equals: lesson_id }, users: { equals: user?.user?.id } },
  })
  revalidatePath('/lessons')
  revalidatePath('/users')
  return lessonRequests
}
