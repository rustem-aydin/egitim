import type { CollectionConfig } from 'payload'
import { colorPickerField } from '../custom/ColorPicker'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name', // Admin panelinde takımlar listelenirken takım adı görünsün
    group: 'Takımlar',
  },
  labels: {
    singular: 'Takım',
    plural: 'Takımlar',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Takım Adı',

          required: true, // SQL'deki "not null" kısıtlamasının tam karşılığı
        },
        colorPickerField({
          name: 'color',
          label: 'Renk Seç',
          required: true,
          description: 'Bi renk seç',
        }),
      ],
    },
    {
      name: 'groups',
      type: 'join',
      maxDepth: 1,
      collection: 'groups',
      admin: {
        hidden: true,
      },
      on: 'team',
    },
    {
      name: 'experts',
      label: 'Takıma ait Üst Uzmanlıklar',
      type: 'relationship',
      relationTo: 'experts',
      maxDepth: 3,
      admin: {
        position: 'sidebar',
        description: 'Bu takıma ait uzmanlıklar',
      },
      hasMany: true,
    },
  ],
}
