import type { CollectionConfig } from 'payload'
import { colorPickerField } from '../custom/ColorPicker'

export const DrillCategories: CollectionConfig = {
  slug: 'drill-categories', // API adresi: /api/drill-categories
  admin: {
    useAsTitle: 'name', // Admin panelinde kategori ismi başlık olarak görünsün
    group: 'Tatbikat',
    hidden: true,
  },
  labels: {
    singular: 'Tatbikat Kategori',
    plural: 'Tatbikat Kategorileri',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tatkiat Kategori Adı',
      required: true,
      // SQL'de "text null" olduğu için zorunlu (required) yapmadık.
    },
    colorPickerField({
      name: 'color',
      label: 'Renk Seç',
      required: true,
      admin: {
        description: 'Bi renk seç',
      },
    }),
    // id ve created_at Payload tarafından otomatik olarak yönetilir.
  ],
}
