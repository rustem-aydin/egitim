import type { CollectionConfig } from 'payload'
import {
  autoStatusHook,
  dynamicStatusReadHook,
  preventDowngradeIfAssignedHook,
  setCreatedByHook,
  validateDateTo,
} from '../_hooks/Lessons'

export const Lessons: CollectionConfig = {
  slug: 'lessons',

  admin: {
    useAsTitle: 'name',
    group: 'Dersler',
    description:
      'Eğitim derslerinin oluşturulduğu, planlandığı ve takip edildiği koleksiyon. Dersler otomatik olarak tarihe göre durum değiştirir.',
  },
  labels: {
    singular: 'Ders',
    plural: 'Dersler',
  },
  hooks: {
    beforeChange: [autoStatusHook, setCreatedByHook, preventDowngradeIfAssignedHook],
    afterRead: [dynamicStatusReadHook],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Ders Adı',
          required: true,
          admin: {
            description: 'Dersin görünen adı. Örn: "İleri Seviye React Eğitimi"',
          },
        },
        {
          name: 'category',
          label: 'Ders Kategorisi',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: false,
          admin: {
            description: 'Dersin ait olduğu kategori. Örn: Yazılım, Tasarım, Proje Yönetimi.',
          },
        },
        {
          name: 'description',
          label: 'Ders Açıklaması',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'Dersin içeriği, hedefleri ve katılımcılardan beklentiler hakkında detaylı bilgi.',
          },
        },
      ],
    },
    {
      name: 'status',
      label: 'Ders Durumu',
      type: 'select',
      required: true,
      defaultValue: 'Taslak',
      options: [
        { label: 'Taslak', value: 'Taslak' },
        { label: 'Planlanıyor', value: 'Planlanıyor' },
        { label: 'İşleme Alındı', value: 'İşleme Alındı' },
        { label: 'Tamamlandı', value: 'Tamamlandı' },
      ],
      admin: {
        readOnly: true,
        description:
          'Dersin mevcut durumu. Otomatik olarak tarihlere göre güncellenir: Taslak (tarih yok) → Planlanıyor (başlangıç gelecekte) → İşleme Alındı (şu an aktif) → Tamamlandı (bitiş geçmişte).',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'location',
          label: 'Ders Yeri',
          type: 'relationship',
          relationTo: 'locations',
          hasMany: false,
          admin: {
            description: 'Dersin fiziksel veya sanal olarak yapılacağı konum.',
          },
        },
        {
          name: 'students',
          label: 'Katılacak Öğrenci Sayısı',
          type: 'number',
          admin: {
            step: 1,
            description: 'Bu derse kayıtlı veya planlanan toplam öğrenci sayısı.',
          },
        },
        {
          name: 'duration',
          label: 'Eğitim Süresi',
          type: 'number',
          admin: {
            step: 1,
            description: 'Dersin toplam süresi saat cinsinden. Örn: 8 (8 saat)',
          },
        },
      ],
    },
    {
      name: 'instructor',
      label: 'Eğitmen',
      type: 'text',
      admin: {
        description: 'Dersi verecek eğitmenin adı ve soyadı.',
      },
    },
    {
      name: 'rating',
      label: 'Ders Puanı',

      type: 'number',
      admin: {
        step: 0.1,
        hidden: true,
        description:
          'Dersin genel değerlendirme puanı (0-10 arası). Geri bildirimlere göre otomatik hesaplanabilir.',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'date_from',
          label: 'Ders Başlangıç Tarihi',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description:
              'Dersin başlayacağı tarih ve saat. Girildiğinde durum otomatik olarak "Planlanıyor" olur.',
          },
        },
        {
          name: 'date_to',
          label: 'Ders Bitiş Tarihi',
          type: 'date',
          validate: validateDateTo as any,
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Dersin biteceği tarih ve saat.',
          },
        },
      ],
    },
    {
      type: 'upload',
      label: 'Dokümanlar',
      relationTo: 'media',
      name: 'docs',
      hasMany: true,
      admin: {
        description: 'Derslere ait dokümanlar.',
      },
    },
    {
      name: 'by_generate',
      label: 'Dersi Oluşturan',
      type: 'relationship',
      hasMany: false,
      relationTo: 'users',
      admin: {
        hidden: true,
        description: 'Bu dersi oluşturan kullanıcı. Otomatik olarak atanır.',
      },
    },
    {
      name: 'users',
      label: 'Dersi Alanlar',
      maxDepth: 3,
      admin: {
        hidden: true,
        description: 'Bu derse kayıtlı olan kullanıcılar.',
      },
      type: 'join',
      collection: 'users',
      on: 'lessons',
    },
    {
      name: 'lesson_requests',
      label: 'Ders İstekleri',
      maxDepth: 3,
      admin: {
        hidden: true,
        description: 'Bu derse kayıtlı olan kullanıcılar.',
      },
      type: 'join',
      collection: 'lesson-requests',
      on: 'lessons',
    },
    {
      name: 'feedbacks',
      label: 'Geri Bildirimler',
      admin: {
        hidden: true,
        description: 'Derse ait katılımcı geri bildirimleri.',
      },
      type: 'join',
      collection: 'feedbacks',
      on: 'lesson',
    },
    {
      name: 'module',
      type: 'relationship',
      label: 'Derse ait Modül',
      maxDepth: 3,
      relationTo: 'modules',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Bu dersin bağlı olduğu eğitim modülü.',
      },
    },
  ],
}
