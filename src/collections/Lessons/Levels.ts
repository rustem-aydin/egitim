import type { CollectionConfig } from 'payload'

export const Levels: CollectionConfig = {
  slug: 'levels',
  admin: {
    useAsTitle: 'name',
    hidden: true,

    group: 'Dersler',
  },
  labels: {
    singular: 'Seviye',
    plural: 'Seviyeler',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
