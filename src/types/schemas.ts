import { Lesson, LessonRequest } from '@/payload-types'
import { z } from 'zod'

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, 'Ders adı en az 3 karakter olmalıdır.')
    .max(50, 'Ders adı en fazla 50 karakter olabilir.'),

  description: z
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır.')
    .max(500, 'Açıklama en fazla 500 karakter olabilir.'),
})

export const lessonRequestSchema = z.object({
  description: z
    .string()
    .min(3, 'Ders adı en az 3 karakter olmalıdır.')
    .max(50, 'Ders adı en fazla 50 karakter olabilir.'),

  lessons: z.number(),
})

// types/schemas.ts

export const filterSchema = z.object({
  filter_url: z.string().min(1, 'URL gereklidir'),
  filter_group: z.string().min(1, 'Grup gereklidir'),
  description: z
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır.')
    .max(500, 'Açıklama en fazla 500 karakter olabilir.'),
  is_star: z.boolean().default(false),
})
export type LessonFormValues = Pick<Lesson, 'name' | 'description'>

export type LessonRequestsValues = Pick<LessonRequest, 'description' | 'lessons'>
