import type {
  CollectionBeforeChangeHook,
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from 'payload'
import { ValidationError } from 'payload'

export const autoStatusHook: CollectionBeforeChangeHook = ({ data, operation }) => {
  const now = new Date()
  const dateFrom = data.date_from ? new Date(data.date_from) : null
  const dateTo = data.date_to ? new Date(data.date_to) : null

  let newStatus = 'Taslak'

  if (!dateFrom) {
    newStatus = 'Taslak'
  } else if (now < dateFrom) {
    newStatus = 'Planlanıyor'
  } else if (dateTo && now > dateTo) {
    newStatus = 'Tamamlandı'
  } else {
    newStatus = 'İşleme Alındı'
  }

  return {
    ...data,
    status: newStatus,
  }
}

/**
 * Create işleminde oturum açmış kullanıcıyı by_generate alanına ata
 */
export const setCreatedByHook: CollectionBeforeChangeHook = ({ req, operation, data }) => {
  if (operation === 'create' && req.user) {
    return {
      ...data,
      by_generate: req.user.id,
    }
  }
  return data
}

/**
 * Read hook: Admin panelinde ve API'de status'i güncel tarihe göre hesapla
 */
export const dynamicStatusReadHook: CollectionAfterReadHook = ({ doc }) => {
  const now = new Date()
  const dateFrom = doc.date_from ? new Date(doc.date_from) : null
  const dateTo = doc.date_to ? new Date(doc.date_to) : null

  let computedStatus = doc.status || 'Taslak'

  if (!dateFrom) {
    computedStatus = 'Taslak'
  } else if (now < dateFrom) {
    computedStatus = 'Planlanıyor'
  } else if (dateTo && now > dateTo) {
    computedStatus = 'Tamamlandı'
  } else {
    computedStatus = 'İşleme Alındı'
  }

  return {
    ...doc,
    status: computedStatus,
  }
}

/**
 * Validation hook: date_from, date_to'dan büyük olamaz
 */
export const validateDatesHook: CollectionBeforeValidateHook = ({ data, req }) => {
  if (data?.date_from && data.date_to) {
    const dateFrom = new Date(data.date_from)
    const dateTo = new Date(data.date_to)

    if (dateFrom > dateTo) {
      throw new ValidationError(
        {
          errors: [
            {
              message:
                'Ders başlangıç tarihi (date_from), bitiş tarihinden (date_to) sonra olamaz.',
              path: 'date_from',
            },
          ],
        },
        req.t,
      )
    }
  }

  return data
}

export const validateDateTo = (
  value: string | undefined,
  { siblingData }: { siblingData: Record<string, unknown> },
): string | true => {
  if (!value || !siblingData?.date_from) return true

  const dateFrom = new Date(siblingData.date_from as string)
  const dateTo = new Date(value)

  if (dateFrom > dateTo) {
    return 'Ders başlangıç tarihi bitiş tarihinden sonra olamaz.'
  }

  return true
}

// ✅ YENİ: İşleme Alındı/Tamamlandı → Taslak/Planlanıyor geçişini engelle
export const preventDowngradeIfAssignedHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update') return data

  const oldStatus = originalDoc?.status as string
  const newStatus = data.status as string

  // Status değişmiyorsa kontrol etme
  if (!newStatus || oldStatus === newStatus) return data

  // Sadece "İşleme Alındı" veya "Tamamlandı" durumundan "Taslak" veya "Planlanıyor"a geçişi engelle
  const activeStatuses = ['İşleme Alındı', 'Tamamlandı']
  const inactiveStatuses = ['Taslak', 'Planlanıyor']

  const isDowngrade = activeStatuses.includes(oldStatus) && inactiveStatuses.includes(newStatus)

  if (!isDowngrade) return data

  // Bu dersi alan personelleri bul
  try {
    const assignedUsers = await req.payload.find({
      collection: 'users',
      where: {
        lessons: {
          in: [originalDoc.id],
        },
      },
      depth: 0,
    })

    if (assignedUsers.docs.length > 0) {
      const userNames = assignedUsers.docs.map((u: any) => u.name || u.email || u.id).join(', ')
      throw new ValidationError(
        {
          errors: [
            {
              message:
                `Bu ders "${oldStatus}" durumundayken ${assignedUsers.docs.length} personele atanmıştır (${userNames}). ` +
                `Durumu "${newStatus}" olarak değiştiremezsiniz. ` +
                `Öncelikle bu dersi ilgili personellerden kaldırmanız gerekmektedir.`,
              path: 'status',
            },
          ],
        },
        req.t,
      )
    }
  } catch (error: any) {
    if (error.message.includes('Bu ders')) throw error
    console.error('Ders atama kontrolü sırasında hata:', error)
  }

  return data
}
