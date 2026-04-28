'use client'

import { startTransition, useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DrillCategory } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterDrillCategoryProps {
  drillCategories: DrillCategory[]
  startTransition: React.TransitionStartFunction
}

export default function FilterDrillCategory({
  drillCategories,
  startTransition,
}: FilterDrillCategoryProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentValue = searchParams.get('drill_category') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = drillCategories?.find(
      (c: any) => c.name.toLowerCase() === selectedValue.toLowerCase(),
    )
    const finalName = selectedItem?.name || selectedValue

    if (currentValue === finalName) {
      params.delete('drill_category')
    } else {
      params.set('drill_category', finalName)
    }

    setOpen(false)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 w-full min-w-25 max-w-30">
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
                  drillCategories?.find(
                    (c: any) => c.name.toLowerCase() === currentValue.toLowerCase(),
                  )?.name || currentValue
                ) : (
                  <span className="text-muted-foreground text-xs">Seçiniz</span>
                )}
                <ChevronDownIcon
                  size={16}
                  className="text-muted-foreground/80 shrink-0 ml-1"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Kategori Seçin</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="border-input w-[200px] p-0" align="start">
          <Command>
            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandEmpty>Kategori bulunamadı.</CommandEmpty>
              <CommandGroup>
                {drillCategories?.map((option: any) => (
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
