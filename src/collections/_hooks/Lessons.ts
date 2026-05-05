import type {
  CollectionBeforeChangeHook,
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from 'payload'

/**
 * Otomatik status geçişleri:
 * 1. date_from yoksa → Taslak
 * 2. date_from var ama şu an date_from'dan önceyse → Planlanıyor
 * 3. date_from <= şu an <= date_to → İşleme Alındı
 * 4. date_to < şu an → Tamamlandı
 */
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
export const validateDatesHook: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (data?.date_from && data.date_to) {
    const dateFrom = new Date(data.date_from)
    const dateTo = new Date(data.date_to)

    if (dateFrom > dateTo) {
      throw new Error('Ders başlangıç tarihi (date_from), bitiş tarihinden (date_to) sonra olamaz.')
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
    return 'Ders başlangıç tarihi bitiş tarihinden  sonra olamaz.'
  }

  return true
}
