'use client'

import { useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Category } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterCategoryProps {
  categories: Category[]
  startTransition: React.TransitionStartFunction
}

export default function FilterCategories({ categories, startTransition }: FilterCategoryProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategoryValue = searchParams.get('category') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = categories?.find(
      (c) => c.name?.toLowerCase() === selectedValue.toLowerCase(),
    )
    const finalValue = selectedItem?.name || selectedValue

    if (currentCategoryValue === finalValue) {
      params.delete('category')
    } else {
      params.set('category', finalValue)
    }

    setOpen(false)

    const newUrl = `${pathname}?${params.toString()}`
    startTransition(() => {
      router.push(newUrl, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 w-full min-w-25 max-w-25">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentCategoryValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                <span className="truncate text-left flex-1">
                  {currentCategoryValue ? (
                    categories?.find(
                      (c) => c.name?.toLowerCase() === currentCategoryValue.toLowerCase(),
                    )?.name || currentCategoryValue
                  ) : (
                    <span className="text-muted-foreground">Kategori</span>
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
            <p>Ders Kategorisi</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {categories?.map((option) => (
                  <CommandItem
                    key={option.id || option.name}
                    value={String(option.name)}
                    onSelect={handleSelect}
                  >
                    {option.name}
                    {currentCategoryValue === option.name && (
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
