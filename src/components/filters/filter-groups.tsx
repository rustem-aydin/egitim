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
import { Group } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterGroupsProps {
  groups: Group[]
  startTransition: React.TransitionStartFunction
}

export default function FilterGroups({ groups, startTransition }: FilterGroupsProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentGroupValue = searchParams.get('group') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = groups?.find((g) => g.name?.toLowerCase() === selectedValue.toLowerCase())
    const finalName = selectedItem?.name || selectedValue

    if (currentGroupValue === finalName) {
      params.delete('group')
    } else {
      params.set('group', finalName)
    }

    setOpen(false)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 w-full min-w-25 max-w-25">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentGroupValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                {currentGroupValue ? (
                  <div className="flex items-center truncate gap-2">
                    <span className="truncate">
                      {groups?.find(
                        (g) => g.name?.toLowerCase() === currentGroupValue.toLowerCase(),
                      )?.name || currentGroupValue}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Kadro</span>
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
            <p>Kadro</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Birim ara..." />
            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {groups?.map((locationGroup) => (
                  <CommandItem
                    key={locationGroup.id || locationGroup.name}
                    value={String(locationGroup.name)}
                    onSelect={handleSelect}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>{locationGroup.name}</span>
                    </div>
                    {currentGroupValue === locationGroup.name && (
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
