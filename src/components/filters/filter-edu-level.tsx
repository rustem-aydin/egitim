'use client'

import { useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterLevelsProps {
  startTransition: React.TransitionStartFunction
}

export default function FilterEduLevel({ startTransition }: FilterLevelsProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const currentValue = searchParams.get('education_level') || ''

  const levels = [
    { id: 1, name: 'Önlisans' },
    { id: 2, name: 'Lisans' },
    { id: 3, name: 'Yüksek Lisans' },
    { id: 4, name: 'Doktora' },
  ]

  const handleSelect = (selectedValue: string) => {
    const selectedLevel = levels.find((l) => l.name.toLowerCase() === selectedValue.toLowerCase())
    const finalValue = selectedLevel?.name || ''
    const params = new URLSearchParams(searchParams.toString())

    if (currentValue === finalValue) {
      params.delete('education_level')
    } else {
      params.set('education_level', finalValue)
    }

    setOpen(false)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 w-full min-w-25 max-w-25">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                {currentValue ? (
                  <div className="flex items-center truncate gap-2">
                    <span className="truncate">
                      {levels?.find((l) => l.name?.toLowerCase() === currentValue.toLowerCase())
                        ?.name || currentValue}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground truncate">Eğitim Seviyesi</span>
                )}
                <ChevronDownIcon
                  size={16}
                  className="text-muted-foreground/80 shrink-0"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eğitim Seviyesi</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {levels.map((option) => (
                  <CommandItem key={option.id} value={option.name} onSelect={handleSelect}>
                    {option.name}
                    {currentValue === option.name && <CheckIcon size={16} className="ml-auto" />}
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
