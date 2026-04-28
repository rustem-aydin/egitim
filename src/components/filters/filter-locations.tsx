'use client'

import { useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
import { Location } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterLocationProps {
  locations: Location[]
  startTransition: React.TransitionStartFunction
}

export default function FilterLocation({ locations, startTransition }: FilterLocationProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentLocationValue = searchParams.get('location') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = locations?.find(
      (l: any) => l.name.toLowerCase() === selectedValue.toLowerCase(),
    )
    const finalName = selectedItem?.name || selectedValue

    if (currentLocationValue === finalName) {
      params.delete('location')
    } else {
      params.set('location', finalName)
    }

    setOpen(false)

    const newUrl = `${pathname}?${params.toString()}`
    startTransition(() => {
      router.push(newUrl, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentLocationValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="border-input max-w-24 justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                <span className="truncate text-left flex-1">
                  {currentLocationValue ? (
                    locations?.find(
                      (locationGroup: any) =>
                        locationGroup.name.toLowerCase() === currentLocationValue.toLowerCase(),
                    )?.name || currentLocationValue
                  ) : (
                    <span className="text-muted-foreground">Lokasyon</span>
                  )}
                </span>

                <ChevronDownIcon
                  size={16}
                  className="text-muted-foreground/80 shrink-0 ml-2"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lokasyon</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Lokasyon ara..." />
            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {locations?.map((locationGroup: any) => (
                  <CommandItem
                    key={locationGroup.id || locationGroup.name}
                    value={locationGroup.name}
                    onSelect={handleSelect}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>{locationGroup.name}</span>
                    </div>
                    {currentLocationValue === locationGroup.name && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
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
