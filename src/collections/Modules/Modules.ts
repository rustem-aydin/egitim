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
      name: 'code',
      label: 'Modül Kodu',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: ' (Örn: C103.1, A101.2)',
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
    {
      name: 'experts',
      type: 'join',
      collection: 'experts',
      maxDepth: 3,
      label: 'Bu Modülü Zorunlu Alaması Gereken Gruplar',
      admin: {
        position: 'sidebar',
      },
      on: 'modules',
    },
  ],
}
