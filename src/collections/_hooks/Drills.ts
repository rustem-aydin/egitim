import type { FieldHook } from 'payload'
import { ValidationError } from 'payload'

export const validateDateTo: FieldHook = ({ value, siblingData, field, req }) => {
  if (value && siblingData?.date_from) {
    const dateFrom = new Date(siblingData.date_from as string)
    const dateTo = new Date(value as string)

    if (dateTo < dateFrom) {
      throw new ValidationError(
        {
          errors: [
            {
              message: 'Bitiş tarihi, başlangıç tarihinden önce olamaz.',
              label: 'Tatbikat Başlangıç Tarihi',
              path: field?.name || 'date_to',
            },
          ],
        },
        req?.t,
      )
    }
  }
  return value
}
