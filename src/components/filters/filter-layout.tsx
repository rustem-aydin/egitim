'use client'

import { useId, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  CheckIcon,
  SortDesc,
  Calendar,
  Grip,
  GanttChart,
  Table,
  Kanban,
  ChartArea,
  Puzzle,
  ChartNetwork,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { sankey } from '@visx/sankey'

interface SortConfig {
  icon: React.ReactNode
  label: string
}

const sortConfigs: Record<string, SortConfig> = {
  grid: {
    icon: <Grip size={16} />,
    label: 'Grid',
  },
  chart: {
    icon: <ChartArea size={16} />,
    label: 'Grafikler',
  },
  sankey: {
    icon: <ChartNetwork size={16} />,
    label: 'Sankey',
  },
  modules: {
    icon: <Puzzle size={16} />,
    label: 'Modüller',
  },
  topLessonsCompleters: {
    icon: <ChartArea size={16} />,
    label: 'Ders Tamamlama',
  },
  moduleProgressChart: {
    icon: <ChartArea size={16} />,
    label: 'Modül Tamamlama',
  },
  table: {
    icon: <Table size={16} />,
    label: 'Tablo',
  },
  kanban: {
    icon: <Kanban size={16} />,
    label: 'Kanban',
  },
  gant: {
    icon: <GanttChart size={16} />,
    label: 'Gant',
  },
}

interface SortSelectProps {
  options: string[]
  startTransition: React.TransitionStartFunction
}

export default function Layout({ options, startTransition }: SortSelectProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const currentSortValue = searchParams.get('layout') || ''

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentSortValue === selectedValue) {
      params.delete('layout')
    } else {
      params.set('layout', selectedValue)
    }

    setOpen(false)

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const getSelectedIcon = () => {
    if (!currentSortValue) return <Grip size={16} />
    return sortConfigs[currentSortValue]?.icon || <SortDesc size={16} />
  }

  const availableOptions = options.filter((key) => sortConfigs[key])

  return (
    <div className="*:not-first:mt-2 min-w-9 max-w-4">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentSortValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-center px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                <span className="flex items-center justify-center">{getSelectedIcon()}</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Yerleşim</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList className="max-h-[200px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {availableOptions.map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => handleSelect(value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {sortConfigs[value].icon}
                    <span>{sortConfigs[value].label}</span>
                    {currentSortValue === value && <CheckIcon size={16} className="ml-auto" />}
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
