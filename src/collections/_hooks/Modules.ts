import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'

export const preventKCodeForTeams: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
  operation,
}) => {
  const newCode = data.code as string | undefined

  // Code yoksa veya K ile başlamıyorsa sorun yok
  if (!newCode || !newCode.toUpperCase().startsWith('K')) {
    return data
  }

  // Sadece update'te kontrol et
  if (operation !== 'update') return data

  const moduleId = originalDoc?.id

  if (!moduleId) return data

  // Takıma atanmış mı kontrol et
  const teamQuery = await req.payload.find({
    collection: 'teams',
    where: {
      modules: {
        contains: moduleId,
      },
    },
    limit: 1,
  })

  if (teamQuery.docs.length > 0) {
    throw new ValidationError(
      {
        errors: [
          {
            message:
              'Bu modül bir takıma atandığından dolayı "K" harfi ile başlayan kod atanamaz. Takım modülleri A, B veya C harfi ile başlamalıdır.',
            path: 'code',
            label: 'Modül Kodu',
          },
        ],
      },
      req.t,
    )
  }

  return data
}
