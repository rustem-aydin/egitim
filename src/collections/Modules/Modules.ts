import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  folders: true,
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Modüller',
  },
  labels: {
    singular: 'Modül',
    plural: 'Modüller',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Modül Adı',
      required: true,
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
    },
    {
      name: 'parentModule',
      type: 'relationship',
      relationTo: 'parentModules',
      label: 'Modülün Üst Modülü',
      hasMany: false,
    },
    {
      name: 'code',
      label: 'Modül Kodu',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'Üst modül seçildikten sonra otomatik olarak oluşturulur. (Örn: C103.1, A101.2)',
      },
    },
    {
      name: 'lessons',
      label: 'Dersler',
      maxDepth: 3,
      type: 'join',
      collection: 'lessons',
      on: 'module',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Sadece create'te çalış, veya update'te parentModule değiştiyse
        const hasParentChange = data.parentModule !== undefined

        if (operation === 'update' && !hasParentChange) {
          return data
        }

        let parentId: string | number | undefined

        if (data.parentModule !== undefined && data.parentModule !== null) {
          if (typeof data.parentModule === 'string') {
            parentId = data.parentModule
          } else if (typeof data.parentModule === 'number') {
            parentId = data.parentModule.toString()
          } else if (typeof data.parentModule === 'object') {
            const pm = data.parentModule as any
            parentId = pm.id || pm.value || pm._id
            if (typeof parentId === 'number') parentId = parentId.toString()
          }
        }

        if (!parentId) {
          return data
        }

        try {
          const parentDoc = await req.payload.findByID({
            collection: 'parentModules',
            id: parentId,
            depth: 0,
          })

          if (!parentDoc?.code) {
            return data
          }

          const parentCode = parentDoc.code as string

          // Kardeş modülleri bul
          const siblings = await req.payload.find({
            collection: 'modules',
            where: {
              and: [
                {
                  parentModule: {
                    equals: parentId,
                  },
                },
                {
                  code: {
                    like: `${parentCode}.%`,
                  },
                },
              ],
            },
            depth: 0,
            limit: 100,
          })

          let maxNum = 0

          siblings.docs.forEach((mod) => {
            if (originalDoc && mod.id === originalDoc.id) {
              return
            }

            const code = mod.code as string
            if (!code) return

            const parts = code.split('.')
            if (parts.length >= 2) {
              const lastPart = parts[parts.length - 1]
              const num = parseInt(lastPart, 10)
              if (!isNaN(num) && num > maxNum) {
                maxNum = num
              }
            }
          })

          const newCode = `${parentCode}.${maxNum + 1}`
          data.code = newCode
        } catch (err) {
          console.error('Hook hatası:', err)
        }

        return data
      },
    ],
  },
}
