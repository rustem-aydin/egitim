import type { CollectionConfig } from 'payload'

export const ParentModules: CollectionConfig = {
  slug: 'parentModules',
  access: {
    read: () => true, // ← bunu ekle
  },
  admin: {
    useAsTitle: 'name', // Admin panelinde listelenirken 'name' alanı başlık olarak görünsün
    group: 'Modüller',
  },
  labels: {
    singular: 'Üst Modül',
    plural: 'Üst Modüller',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Modül Adı',
    },

    {
      name: 'code',
      label: 'Modül Kodu',
      type: 'text',
      unique: true,
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
    },
    {
      name: 'modules',
      type: 'join',
      collection: 'modules',
      label: 'Alt Modüller',
      admin: {
        position: 'sidebar',
      },
      on: 'parentModule',
    },
    {
      name: 'groups',
      type: 'join',
      collection: 'groups',
      label: 'Bu Modülü Zorunlu Alaması Gereken Gruplar',
      admin: {
        position: 'sidebar',
      },
      on: 'parentModules', // groups collection'ındaki modules field adı
    },
    {
      name: 'teams',
      type: 'join',
      collection: 'teams',
      label: 'Bu Modülü Zorunlu Alaması Gereken Takımlar',

      admin: {
        position: 'sidebar',
      },
      on: 'parentModules',
    },
  ],
}
