import type { CollectionConfig } from 'payload'
import { colorPickerField } from '../custom/ColorPicker'

export const Categories: CollectionConfig = {
  slug: 'categories', // API adresi: /api/categories
  admin: {
    hidden: true,
  },
  labels: {
    singular: 'Kategori',
    plural: 'Kategoriler',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Kategori Adı',
      // SQL'de "text null" olduğu için zorunlu (required) yapmadık.
    },
    colorPickerField({
      name: 'color',
      label: 'Renk Seç',
      required: true,
      description: 'Bi renk seç',
    }),
    // id ve created_at Payload tarafından otomatik olarak yönetilir.
  ],
}
