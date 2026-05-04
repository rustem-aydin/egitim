'use client'

import { useId, useMemo, useState } from 'react'

import { ChevronsUpDownIcon, XIcon, CheckIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Module } from '@/payload-types'
import BadgeModule from '../pages/modules/modules-badge-code'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterInCompletedModulesProps {
  modules: Module[]
  startTransition: React.TransitionStartFunction
}

const MAX_SHOWN_ITEMS = 3

export default function FilterInCompletedModules({
  modules,
  startTransition,
}: FilterInCompletedModulesProps) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Modülleri formatlayarak options oluşturuyoruz
  const options = useMemo(() => {
    return (modules || [])
      .filter((m) => m && (m.code || m.id || m.name))
      .map((m) => ({
        value: String(m.code || m.id || m.name),
        label: String(m.name || m.code || m.id || 'İsimsiz Modül'),
        code: m.code,
        name: m.name,
        id: m.id,
      }))
  }, [modules])

  // URL'den seçili değerleri alıyoruz
  const urlValues = searchParams.get('requiredInCompletedModules')?.split(',').filter(Boolean) || []

  // Seçili modülleri buluyoruz (value bazında eşleşme)
  const selectedModules = useMemo(() => {
    return options.filter((opt) => urlValues.includes(opt.value))
  }, [options, urlValues])

  const toggleSelection = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const currentValues = selectedModules.map((s) => s.value)
    let newValues: string[]

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    if (newValues.length > 0) {
      params.set('requiredInCompletedModules', newValues.join(','))
    } else {
      params.delete('requiredInCompletedModules')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const removeSelection = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const newValues = selectedModules.map((s) => s.value).filter((v) => v !== value)

    if (newValues.length > 0) {
      params.set('inCompletedModules', newValues.join(','))
    } else {
      params.delete('inCompletedModules')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const visibleItems = useMemo(
    () => (expanded ? selectedModules : selectedModules.slice(0, MAX_SHOWN_ITEMS)),
    [expanded, selectedModules],
  )
  const hiddenCount = selectedModules.length - visibleItems.length

  return (
    <div className=" max-w-27  space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || urlValues.length > 0} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger
              id={id}
              role="combobox"
              aria-expanded={open}
              className="flex min-h-8 h-8 max-w-xs w-full items-start justify-between rounded-md border border-border/60 bg-background/10 p-1 text-sm shadow-xs outline-none transition-colors hover:bg-accent/10 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <div className="flex flex-wrap  items-center gap-1">
                {selectedModules.length > 0 ? (
                  <>
                    {visibleItems.map((modul) => (
                      <BadgeModule code={modul.code} key={modul.value}>
                        {/* Seçildiğinde sadece code gösteriyoruz */}
                        {modul.code || modul.value}
                        <button
                          type="button"
                          className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                          onClick={(event) => {
                            event.stopPropagation()
                            removeSelection(modul.value)
                          }}
                        >
                          <XIcon className="size-3" />
                        </button>
                      </BadgeModule>
                    ))}
                    {(hiddenCount > 0 || expanded) && (
                      <Badge
                        variant="outline"
                        className="rounded-lg border-dashed border-border/60 bg-transparent px-2.5 py-1 text-xs"
                      >
                        {expanded ? 'Daha az göster' : `+${hiddenCount} daha`}
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground mt-0.5">Modül seçin...</span>
                )}
              </div>
              <ChevronsUpDownIcon
                className="text-muted-foreground/80 mt-1 size-4 shrink-0"
                aria-hidden="true"
              />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tamamlanması gereken modüller</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-(--radix-popper-anchor-width) p-0"
          align="center"
        >
          <Command className="rounded-2xl!">
            <CommandInput placeholder="Modül ara..." className="h-10 px-2" />
            <CommandList>
              <CommandEmpty>Modül bulunamadı.</CommandEmpty>
              <CommandGroup>
                {options.map((modul) => (
                  <CommandItem
                    key={modul.id}
                    value={String(modul.name)}
                    data-checked={selectedModules.some((s) => s.value === modul.value)}
                    onSelect={() => toggleSelection(modul.value)}
                    className="flex items-center rounded-lg pr-2"
                  >
                    <div className="flex w-full items-center gap-1">
                      <BadgeModule code={modul?.code}></BadgeModule>
                      <span>{modul.name}</span>
                    </div>
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
