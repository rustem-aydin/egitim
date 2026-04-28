import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'name', // Admin panelinde ID yerine grubun adı görünsün
    group: 'Gruplar',
  },
  labels: {
    singular: 'Grup',
    plural: 'Gruplar',
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
      admin: {
        description: 'Gruba ait takım',
      },
    },

    {
      name: 'parentModules',
      type: 'relationship',
      label: 'Gruba Ait Modüller',
      relationTo: 'parentModules',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Bu gruba atanmış modüller',
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
