import type { FieldHook } from 'payload'

export const validateDateTo: FieldHook = ({ value, siblingData, field }) => {
  if (value && siblingData?.date_from) {
    const dateFrom = new Date(siblingData.date_from as string)
    const dateTo = new Date(value as string)

    if (dateTo < dateFrom) {
      return 'Bitiş tarihi, başlangıç tarihinden önce olamaz.'
    }
  }
  return value
}
