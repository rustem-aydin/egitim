import type { CollectionConfig } from 'payload'
import { validateDateTo } from '../_hooks/Drills'

export const Drills: CollectionConfig = {
  slug: 'drills', // API adresi: /api/drills
  admin: {
    useAsTitle: 'name',
    group: 'Tatbikat',
    // components: {
    //   views: {
    //     list: {
    //       Component: '/components/payload/Drillslistview',
    //     },
    //   },
    // },
  },
  labels: {
    singular: 'Tatbikat',
    plural: 'Tatbikatlar',
  },

  fields: [
    {
      name: 'name',
      label: 'Tatbikat Adı',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea', // Uzun açıklamalar için textarea daha uygundur
    },
    {
      name: 'location',
      label: 'Tatbikat Yeri',
      type: 'text',
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Katılımcılar',
    },
    {
      name: 'date_from',
      label: 'Tatbikat Başlangıç Tarihi',
      type: 'date',

      admin: {
        date: {
          pickerAppearance: 'dayAndTime', // Tarih ve saat seçici
        },
      },
    },
    {
      name: 'date_to',
      type: 'date',
      label: 'Tatbikat Bitiş Tarihi',
      hooks: {
        beforeValidate: [validateDateTo],
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'info_url',
      label: 'Tatbikat Bilgi URL',
      type: 'text',
    },
    {
      name: 'group', // SQL'deki "group_id" (bigint) alanı
      label: 'Tatbikat Grubu',
      type: 'relationship',
      relationTo: 'drill-groups', // 'drill-groups' adında bir collection olduğunu varsayıyoruz
      hasMany: false,
    },

    // id ve created_at Payload tarafından otomatik yönetilir.
  ],
}
