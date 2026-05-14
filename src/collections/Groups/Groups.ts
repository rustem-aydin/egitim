import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'name', // Admin panelinde ID yerine grubun adı görünsün
    group: 'Kadrolar',
  },
  labels: {
    singular: 'Kadro',
    plural: 'Kadrolar',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Grup Adı',
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      hasMany: false,
      maxDepth: 3,
      admin: {
        description: 'Gruba ait takım',
      },
    },
    {
      name: 'modules',
      type: 'relationship',
      label: 'Gruba Ait Modüller',
      relationTo: 'modules',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Gruba ait modüller',
      },
    },
    {
      name: 'users',
      type: 'join',
      collection: 'users',
      maxDepth: 3,
      admin: {
        hidden: true,
      },
      on: 'group',
    },
  ],
}
