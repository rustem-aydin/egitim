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
      name: 'experts',
      type: 'relationship',
      label: 'Gruba Ait Uzmanlıklar',
      relationTo: 'experts',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Gruba ait uzmanlıklar',
      },
    },
    {
      name: 'users',
      type: 'join',
      collection: 'users',
      admin: {
        hidden: true,
      },
      on: 'group',
    },
  ],
}
