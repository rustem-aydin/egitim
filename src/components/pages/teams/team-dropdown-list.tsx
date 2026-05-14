'use client'

import { useId, useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Team, User } from '@/payload-types'

export default function TeamsDropdownList({ teams }: { teams: Team[] }) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  // URL'deki id parametresini al (örn: /users/6 -> "6")
  const urlId = params?.id as string
  const currentTeams = teams?.find((u) => String(u.id) === urlId)
  const currentValue = currentTeams?.name || ''

  const [open, setOpen] = useState<boolean>(false)

  const handleSelect = (selectedValue: string) => {
    const selectedItem = teams?.find((u) => u.name?.toLowerCase() === selectedValue.toLowerCase())
    const selectedId = selectedItem?.id

    setOpen(false)

    // Eğer aynı kullanıcı seçildiyse veya "Personel" (boş) seçildiyse /users'a git
    if (!selectedId || String(selectedId) === urlId) {
      router.push('/teams', { scroll: false })
    } else {
      // Farklı kullanıcı seçildiyse /users/[id]'ye git
      router.push(`/teams/${selectedId}`, { scroll: false })
    }
  }

  return (
    <div className="*:not-first:mt-2 w-full " style={{ maxWidth: 200 }}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            {currentValue ? (
              <div className="flex items-center min-w-0 flex-1 gap-2">
                <span className="truncate">{currentValue}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Personel</span>
            )}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Kullanıcı ara..." />

            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {teams?.map((team) => (
                  <CommandItem key={team.id} value={String(team.name)} onSelect={handleSelect}>
                    <div className="flex w-full items-center justify-between">
                      <span>{team.name}</span>
                    </div>
                    {currentValue === team.name && <CheckIcon size={16} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
