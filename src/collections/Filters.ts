import { CollectionConfig } from 'payload'

export const Filters: CollectionConfig = {
  slug: 'filters',
  admin: {
    useAsTitle: 'description',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return {
        users: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'filter_url',
      type: 'text',
      required: true,
      label: 'Filtre URL',
    },
    {
      name: 'filter_group',
      type: 'text',
      required: true,
      label: 'Filtre Grubu',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Açıklama',
    },
    {
      name: 'is_star',
      type: 'checkbox',
      defaultValue: false,
      label: 'Yıldızlı',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sıralama',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'users',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Kullanıcı',
    },
  ],
}
