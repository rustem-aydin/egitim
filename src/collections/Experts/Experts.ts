import type { CollectionConfig } from 'payload'

export const Expert: CollectionConfig = {
  slug: 'experts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Uzmanlıklar',
  },
  labels: {
    singular: 'Uzmanlık',
    plural: 'Uzmanlıklar',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Modül Adı',
    },

    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
    },

    {
      name: 'modules',
      type: 'relationship',
      label: 'Modüller',
      relationTo: 'modules',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'groups',
      type: 'join',
      collection: 'groups',
      label: 'Bu Modülü Zorunlu Alaması Gereken Gruplar',
      maxDepth: 5,
      admin: {
        position: 'sidebar',
      },
      on: 'experts',
    },
    {
      name: 'teams',
      type: 'join',
      collection: 'teams',
      maxDepth: 2,
      admin: {
        position: 'sidebar',
        hidden: true,
      },
      on: 'experts',
    },
  ],
}
