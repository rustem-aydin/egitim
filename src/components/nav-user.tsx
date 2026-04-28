'use client'
import { ChevronsUpDown, LogOut, Moon, Sun, Sparkles, Cloud, User as USerInfo } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button' // Button import edildi
import Link from 'next/link'
import { User } from '@/payload-types'
import { useThemeToggle } from './theme-toggle'
import { logoutAction } from '@/actions/server/auth'
import { useRouter } from 'next/navigation'

interface NavUserProps {
  user: User | any
}
export function NavUser({ user }: NavUserProps) {
  const router = useRouter()
  const { isDark, toggleTheme } = useThemeToggle({
    variant: 'rectangle',
    start: 'top-down',
    blur: true,
  })
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* SidebarMenuButton yerine normal Button kullanıyoruz ama aynı stili veriyoruz */}
            <Button
              variant="ghost"
              className="h-12 w-full justify-start gap-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={'/logo.png'} alt={String(user?.name)} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{String(user?.name) || 'Kullanıcı'}</span>
                <span className="truncate text-xs">{user?.rank || 'Üye'}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={'/logo.png'} alt={String(user?.name)} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{String(user?.name)}</span>
                  <span className="truncate text-xs">{String(user?.email)}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/users/${user?.id}`}
                  className="cursor-pointer w-full flex items-center"
                >
                  <USerInfo className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Tema Değiştir
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logoutAction()
                router.refresh()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
