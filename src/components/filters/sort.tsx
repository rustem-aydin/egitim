'use client'

import { useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, SortDesc } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface SortOption {
  value: string
  label: string
}

interface SortSelectProps {
  sortOptions: SortOption[]
  startTransition: React.TransitionStartFunction
}

export default function SortSelect({ sortOptions, startTransition }: SortSelectProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const currentSortValue = searchParams.get('sort') || ''

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentSortValue === selectedValue) {
      params.delete('sort')
    } else {
      params.set('sort', selectedValue)
    }

    setOpen(false)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const getSelectedLabel = () => {
    const selectedOption = sortOptions.find((option) => option.value === currentSortValue)
    return selectedOption?.label || <SortDesc size={16} />
  }

  return (
    <div className="*:not-first:mt-2 min-w-8 max-w-20">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentSortValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                <span className={!currentSortValue ? 'text-muted-foreground truncate' : 'truncate'}>
                  {getSelectedLabel()}
                </span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sıralama</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList className="max-h-[200px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {sortOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {option.label}
                    {currentSortValue === option.value && (
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
