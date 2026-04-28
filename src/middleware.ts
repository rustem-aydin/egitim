// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Statik dosyalar (Resim, CSS, JS)
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // -----------------------------------------------------------
  // 2. KİLİTLEME MANTIĞI
  // -----------------------------------------------------------

  const token = request.cookies.get('payload-token')?.value

  // Eğer token YOKSA -> Payload'ın Admin Login sayfasına yönlendir
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)

    // Kullanıcı giriş yaptıktan sonra asıl gitmek istediği yere dönsün
    // Payload bu parametreyi genellikle okur ve yönlendirir
    loginUrl.searchParams.set('redirect', pathname)

    return NextResponse.redirect(loginUrl)
  }

  // Token varsa geç
  return NextResponse.next()
}

export const config = {
  // Tüm siteyi kapsa
  matcher: '/:path*',
}
