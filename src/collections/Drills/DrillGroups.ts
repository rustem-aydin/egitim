import type { CollectionConfig } from 'payload'

export const DrillGroups: CollectionConfig = {
  slug: 'drill-groups', // API adresi: /api/drill-groups
  admin: {
    useAsTitle: 'name', // Admin panelinde grup adı görünsün
    group: 'Tatbikat',
    hidden: true,
  },
  labels: {
    singular: 'Tatbikat Grubu',
    plural: 'Tatbikat Grupları',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tatbikat Grup Adı',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Tatbikat Kategorisi',
      relationTo: 'drill-categories',
      hasMany: false,
      admin: {
        description: 'Bu grubun bağlı olduğu tatbikat kategorisi',
      },
    },
  ],
}
