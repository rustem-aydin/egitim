'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Category } from '@/payload-types'

export const getAllCategories = async (): Promise<Category[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'categories',
    depth: 0,
  })

  return cats.docs // ✅ sadece array'i döndür
}
