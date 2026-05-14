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
import { Lesson } from '@/payload-types'

export default function LessonsDropdownList({ lessons }: { lessons: Lesson[] }) {
  const id = useId()
  const router = useRouter()
  const params = useParams()

  // URL'deki id parametresini al (örn: /lessons/6 -> "6")
  const urlId = params?.id as string
  const currentUser = lessons?.find((u) => String(u.id) === urlId)
  const currentValue = currentUser?.name || ''

  const [open, setOpen] = useState<boolean>(false)

  const handleSelect = (selectedValue: string) => {
    const selectedItem = lessons?.find((u) => u.name?.toLowerCase() === selectedValue.toLowerCase())
    const selectedId = selectedItem?.id

    setOpen(false)

    // Eğer aynı kullanıcı seçildiyse veya "Personel" (boş) seçildiyse /lessons'a git
    if (!selectedId || String(selectedId) === urlId) {
      router.push('/lessons', { scroll: false })
    } else {
      // Farklı kullanıcı seçildiyse /lessons/[id]'ye git
      router.push(`/lessons/${selectedId}`, { scroll: false })
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

            <CommandList className="max-h-[250px] max-w-48 overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {lessons?.map((user) => (
                  <CommandItem key={user.id} value={String(user.name)} onSelect={handleSelect}>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center truncate gap-2">
                        <span className="truncate">{user.name}</span>
                      </div>
                    </div>

                    {currentValue === user.name && <CheckIcon size={16} className="ml-auto" />}
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
