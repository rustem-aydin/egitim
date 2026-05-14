// src/collections/Teams.ts
import type { CollectionConfig } from 'payload'
import { colorPickerField } from '../custom/ColorPicker'
import { validateModules } from '../_hooks/Teams'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
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
          required: true,
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
      maxDepth: 3,
      collection: 'groups',
      admin: { hidden: true },
      on: 'team',
    },
    {
      name: 'modules',
      label: 'Takıma ait Modüller',
      type: 'relationship',
      relationTo: 'modules',
      maxDepth: 3,
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Bu takıma ait modüller',
      },
      validate: validateModules as any,
    },
  ],
}
