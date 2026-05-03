import type { CollectionConfig, Field } from 'payload'

// Ayrı bir factory fonksiyonu olarak da yazabilirsiniz
const reminderButtonField = (): Field => ({
  name: 'reminderButton',
  type: 'ui',
  admin: {
    components: {
      Field: {
        path: '@/collections/custom/ReminderButton#ReminderButton',
        exportName: 'ReminderButton',
      },
    },
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    group: 'Personeller',
  },
  endpoints: [
    {
      path: '/:id/send-reminder',
      method: 'post',
      handler: async (req) => {
        const userId = req.routeParams?.id
        try {
          const user = await req.payload.findByID({
            collection: 'users',
            id: Number(userId),
            depth: 0,
          })

          if (!user.lessons || user.lessons.length === 0) {
            return Response.json({ error: 'Bu personelin aldığı ders yok.' }, { status: 400 })
          }

          const feedbacks = await req.payload.find({
            collection: 'feedbacks',
            where: { user_id: { equals: userId } },
            depth: 0,
            limit: 0,
          })

          const commentedLessonIds = new Set(
            feedbacks.docs.map((fb: any) => fb.lesson?.toString()).filter(Boolean),
          )

          const lessonsWithoutFeedback = user.lessons.filter(
            (lId: any) => !commentedLessonIds.has(lId.toString()),
          )

          if (lessonsWithoutFeedback.length === 0) {
            return Response.json({ message: 'Tüm derslere yorum yapmış.' }, { status: 200 })
          }

          await req.payload.sendEmail({
            to: user.email,
            subject: 'Geri Bildirim Hatırlatması',
            html: `<p>Merhaba ${user.name || 'Personel'},</p><p>${lessonsWithoutFeedback.length} adet ders için hala geri bildirim bırakmadınız.</p>`,
          })

          return Response.json({ message: 'Hatırlatma maili gönderildi.' }, { status: 200 })
        } catch (error) {
          return Response.json({ error: 'Bir hata oluştu.' }, { status: 500 })
        }
      },
    },
  ],
  access: {
    // admin: ({ req: { user } }: any) => user?.is_admin === true,
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  labels: {
    singular: 'Personel',
    plural: 'Personeller',
  },
  fields: [
    // UI Field - Buton burada gözükecek

    {
      name: 'name',
      label: 'Ad Soyad',
      type: 'text',
      required: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id), // ← sadece düzenleme ekranında göster
      },
    },
    {
      name: 'rank',
      label: 'Rütbe',
      type: 'select',
      required: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
      options: [
        { label: 'Asb.Çvş.', value: 'Asb.Çvş.' },
        { label: 'Asb.Kd.Çvş.', value: 'Asb.Kd.Çvş.' },
        { label: 'Asb.Üçvş.', value: 'Asb.Üçvş.' },
        { label: 'Asb.Kd.Üçvş.', value: 'Asb.Kd.Üçvş.' },
        { label: 'Asb.Bçvş.', value: 'Asb.Bçvş.' },
        { label: 'Asb.Kd.Bçvş.', value: 'Asb.Kd.Bçvş.' },
        { label: 'Tğm.', value: 'Tğm' },
        { label: 'Ütğm.', value: 'Ütğm' },
        { label: 'Yzb.', value: 'Yzb' },
        { label: 'Bnb.', value: 'Bnb' },
        { label: 'Yb.', value: 'Yb' },
        { label: 'Alb.', value: 'Alb.' },
      ],
    },
    {
      name: 'lessons',
      label: 'Personelin Aldığı Dersler',
      type: 'relationship',
      relationTo: 'lessons',
      maxDepth: 3,
      hasMany: true,
      required: false,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
    },
    {
      name: 'group',
      type: 'relationship',
      label: 'Üye Kadro',
      relationTo: 'groups',
      maxDepth: 3,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Üyesi Olduğu Kadro',
      },
    },

    {
      name: 'education_levels',
      label: 'Personelin Eğitim Seviyesi',
      type: 'select',
      required: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
      options: [
        { label: 'Önlisans', value: 'Önlisans' },
        { label: 'Yüksek Lisans', value: 'Yüksek Lisans' },
        { label: 'Doktora', value: 'Doktora' },
        { label: 'Lisans', value: 'Lisans' },
      ],
    },
    {
      name: 'yds_score',
      label: 'YDS Puanı',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
    },
    {
      name: 'is_admin',
      label: 'Admin Mi?',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
    },

    {
      name: 'university_names',
      label: 'Üniversite Adları',
      type: 'array',
      labels: {
        singular: 'Üniversite Adı',
        plural: 'Üniversite Adları',
      },
      required: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
      fields: [
        {
          name: 'university',
          label: 'Üniversite Adı',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'certificates',
      label: 'Sertifikalar',

      type: 'array',
      labels: {
        singular: 'Sertifika',
        plural: 'Sertifikalar',
      },
      required: false,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
      fields: [
        {
          name: 'certificate_name',
          label: 'Sertifika Adı',
          type: 'text',
          required: false,
        },
      ],
    },

    {
      name: 'join_date',
      label: 'Personelin Birliği Katılış Tarihi',
      type: 'date',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (_, siblingData) => Boolean(siblingData?.id),
      },
    },
  ],
}
