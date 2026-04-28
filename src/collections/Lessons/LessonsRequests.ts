import type { CollectionConfig } from 'payload'

export const LessonsRequests: CollectionConfig = {
  slug: 'lesson-requests', // API adresi: /api/categories

  admin: {
    useAsTitle: 'description', // Admin panelinde kategori ismi başlık olarak görünsün
    group: 'Dersler',
  },
  labels: {
    singular: 'Ders İsteği',
    plural: 'Ders İstekleri',
  },
  fields: [
    {
      name: 'users',
      type: 'relationship',
      label: 'İstek Yapan Personel',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'İstek Yapan Personel',
      },
    },
    {
      name: 'lessons',
      type: 'relationship',
      label: 'İstek Yapılan Ders',
      relationTo: 'lessons',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'İstek Yapılan Ders',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Açıklama',
      admin: {
        readOnly: true,
      },
      // SQL'de "text null" olduğu için zorunlu (required) yapmadık.
    },
  ],
}
