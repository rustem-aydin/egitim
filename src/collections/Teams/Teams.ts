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
      collection: 'groups',
      admin: {
        hidden: true,
      },
      on: 'team',
    },
    {
      name: 'parentModules',
      label: 'Takıma ait Üst Modüller',
      type: 'relationship',
      relationTo: 'parentModules',
      admin: {
        position: 'sidebar', // İlişki alanlarını genelde sağ menüde (sidebar) tutmak daha şıktır: true,
        description: 'Takıma göre alınması zorunlu modüller',
      },
      hasMany: true, // Bir takımın birden fazla modülü olabilir
    },
  ],
}
