// src/collections/Teams/validateModules.ts
import type { PayloadRequest } from 'payload'
import { ValidationError } from 'payload'

export const validateModules = async (
  value: (string | number)[] | null | undefined,
  { req }: { req: PayloadRequest },
): Promise<string | true> => {
  if (!value || value.length === 0) return true

  const ids = value.map((v) => String(v))

  const modules = await req.payload.find({
    collection: 'modules',
    where: {
      id: {
        in: ids,
      },
    },
    depth: 0,
    limit: ids.length,
  })

  const invalidModule = modules.docs.find((mod) => {
    const code = mod.code as string | undefined
    return code && code.charAt(0) === 'K'
  })

  if (invalidModule) {
    throw new ValidationError(
      {
        errors: [
          {
            message: `Kod "K" ile başlayan modüller takıma atanamaz. Geçersiz modül: "${invalidModule.name}" (${invalidModule.code})`,
            label: 'Takıma ait Modüller',
            path: 'modules',
          },
        ],
      },
      req.t,
    )
  }

  return true
}
