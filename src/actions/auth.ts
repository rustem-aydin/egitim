'use server'

import { logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  try {
    await logout({ allSessions: true, config })
  } catch (error) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // 1. Önce tüm sayfa önbelleğini temizle (veya spesifik bir path: '/')
  revalidatePath('/', 'layout')
}
