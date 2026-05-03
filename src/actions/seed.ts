import type { Payload } from 'payload'

export async function seedData(payload: Payload) {
  // İlk admin kullanıcısı
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@admin.com',
      password: 'admin',
      is_admin: true,
    },
  })
}
