import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { preventKCodeForTeams } from '../_hooks/Modules'

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
  hooks: {
    beforeChange: [preventKCodeForTeams],
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
      name: 'teams',
      type: 'join',
      maxDepth: 2,
      collection: 'teams',
      admin: {
        hidden: true,
      },
      on: 'modules',
    },
    {
      name: 'groups',
      type: 'join',
      maxDepth: 1,
      collection: 'groups',
      admin: {
        hidden: true,
      },
      on: 'modules',
    },
    {
      name: 'code',
      label: 'Modül Kodu',
      type: 'text',
      required: true,
      unique: true,

      admin: {
        position: 'sidebar',
        description: ' (Örn: C103.1, A101.2)',
      },
      validate: (value: any) => {
        if (!value) return true

        const firstChar = value.charAt(0)
        const validChars = ['A', 'B', 'C', 'K']

        if (!validChars.includes(firstChar)) {
          return `Modül kodu büyük harf A, B, C veya K ile başlamalıdır. Girilen: "${value}"`
        }
        if (value.length < 4) {
          return `En az 4 karakter olmalıdır. Girilen: "${value}"`
        }

        return true
      },
    },
    {
      name: 'lessons',
      label: 'Dersler',
      maxDepth: 1,
      type: 'join',
      collection: 'lessons',
      on: 'module',
    },
  ],
}
