'use client'
import * as React from 'react'
import {
  BookOpen,
  Flag,
  FlaskConical,
  LayoutDashboard,
  Network,
  Puzzle,
  Swords,
  Users,
} from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { AvatarImage, Avatar } from './ui/avatar'
import { User } from '@/payload-types'

const data = {
  navMain: [
    {
      title: 'Anasayfa',
      url: '/',
      icon: LayoutDashboard,
    },

    {
      title: 'Takımlar',
      url: '/teams',
      icon: Flag,
    },
    {
      title: 'Personeller',
      icon: Users,
      url: '/users',
    },

    {
      title: 'Kadrolar',
      url: '/groups',
      icon: Network,
    },

    {
      title: 'Modüller',
      url: '/modules',
      icon: Puzzle,
    },
    {
      title: 'Eğitimler',
      url: '/lessons',
      icon: BookOpen,
    },

    {
      title: 'Tatbikatlar',
      url: '/drills',
      icon: Swords,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | any // Layout'tan gönderdiğiniz tipe uygun olmalı
}

// Tek bir süslü parantez içinde her şeyi karşılayın
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <Avatar className="size-12">
                  <AvatarImage src="/logo.png" alt="@shadcn" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Eğitim Modulü</span>
                  <span className="truncate text-xs">Siber Stndz.K.lığı</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
