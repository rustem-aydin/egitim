'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Location } from '@/payload-types'

export const getAllLocations = async (): Promise<Location[]> => {
  const payload = await getPayload({ config })

  const cats = await payload.find({
    collection: 'locations',
    depth: 0,
  })

  return cats.docs // ✅ sadece array'i döndür
}
