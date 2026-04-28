import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name', // Admin panelinde lokasyonlar ismiyle görünsün
    hidden: true,

    group: 'Dersler',
  },
  labels: {
    singular: 'Lokasyon',
    plural: 'Lokasyonlar',
  },
  fields: [
    {
      name: 'name',
      label: 'Eğitim Lokasyon Adı',
      type: 'text',
    },
  ],
}
