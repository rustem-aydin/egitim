'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Filter } from '@/payload-types'

export async function saveFilter(values: Filter) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      throw new Error('Kullanıcı bulunamadı')
    }

    const existing = await payload.find({
      collection: 'filters',
      where: {
        and: [{ filter_url: { equals: values.filter_url } }, { users: { equals: user.user.id } }],
      },
      limit: 1,
    })

    let filter

    if (existing.docs.length > 0) {
      filter = await payload.update({
        collection: 'filters',
        id: existing.docs[0].id,
        data: {
          filter_group: values.filter_group,
          description: values.description,
          is_star: values.is_star ?? false,
        },
      })
    } else {
      // Yeni kayıt için mevcut max order'ı bul
      const allFilters = await payload.find({
        collection: 'filters',
        where: {
          users: { equals: user.user.id },
        },
        sort: '-order',
        limit: 1,
      })

      const nextOrder = allFilters.docs.length > 0 ? (allFilters.docs[0].order || 0) + 1 : 0

      filter = await payload.create({
        collection: 'filters',
        data: {
          filter_url: values.filter_url,
          filter_group: values.filter_group,
          description: values.description,
          is_star: values.is_star ?? false,
          order: nextOrder,
          users: user.user.id,
        },
      })
    }

    revalidatePath('/filters')
    return filter
  } catch (error) {
    console.error('Filter save error:', error)
    throw error
  }
}

// Kullanıcının tüm filtrelerini getir (order'a göre sıralı)
export async function getUserFilters() {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      return []
    }

    const filters = await payload.find({
      collection: 'filters',
      where: {
        users: {
          equals: user.user.id,
        },
      },
      sort: 'order',
    })

    return filters.docs
  } catch (error) {
    console.error('Filters get error:', error)
    return []
  }
}

// Mevcut URL için kullanıcının filtresini getir
export async function getUserFilterByUrl(filterUrl: string) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      return null
    }

    const filters = await payload.find({
      collection: 'filters',
      where: {
        and: [{ filter_url: { equals: filterUrl } }, { users: { equals: user.user.id } }],
      },
      limit: 1,
    })

    return filters.docs[0] || null
  } catch (error) {
    console.error('Filter get error:', error)
    return null
  }
}

// Filtre sil
export async function deleteFilter(id: number) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      throw new Error('Kullanıcı bulunamadı')
    }

    await payload.delete({
      collection: 'filters',
      id,
    })

    revalidatePath('/filters')
    return { success: true }
  } catch (error) {
    console.error('Filter delete error:', error)
    throw error
  }
}

// Filtre yıldızla
export async function toggleFilterStar(id: number, isStar: boolean) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      throw new Error('Kullanıcı bulunamadı')
    }

    const filter = await payload.update({
      collection: 'filters',
      id,
      data: {
        is_star: !isStar,
      },
    })

    revalidatePath('/filters')
    return filter
  } catch (error) {
    console.error('Filter star error:', error)
    throw error
  }
}

// Sıralamayı güncelle (bulk update)
export async function updateFiltersOrder(updates: { id: number; order: number }[]) {
  try {
    const payload = await getPayload({ config })
    const user = await payload.auth({ headers: await headers() })

    if (!user?.user) {
      throw new Error('Kullanıcı bulunamadı')
    }

    // Promise.all ile paralel güncelle
    await Promise.all(
      updates.map(({ id, order }) =>
        payload.update({
          collection: 'filters',
          id,
          data: { order },
        }),
      ),
    )

    revalidatePath('/filters')
    return { success: true }
  } catch (error) {
    console.error('Order update error:', error)
    throw error
  }
}
