import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import '../globals.css'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from './provider'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: await headers() })
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            themes={['light', 'dark', 'night', 'doga', 'stars']}
          >
            <TooltipProvider>
              <SidebarProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                  <div className="  gap-4 p-4 mt-4 pt-0">{children}</div>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
