import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Depolama',
  },
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Depolama',
    plural: 'Depolama',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
