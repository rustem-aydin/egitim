'use client'

import { useId, useState } from 'react'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Team } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterTeamsProps {
  teams: Team[]
  startTransition: React.TransitionStartFunction
}

export default function FilterTeams({ startTransition, teams }: FilterTeamsProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTeamValue = searchParams.get('team') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = teams?.find((t) => t.name.toLowerCase() === selectedValue.toLowerCase())
    const finalName = selectedItem?.name || selectedValue

    if (currentTeamValue === finalName) {
      params.delete('team')
    } else {
      params.set('team', finalName)
    }

    setOpen(false)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 w-full min-w-[100px] max-w-[80px]">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentTeamValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-2 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                {teams?.length === 0 ? (
                  <span className="text-muted-foreground italic">Yükleniyor...</span>
                ) : currentTeamValue ? (
                  <div className="flex gap-2 justify-start items-center truncate">
                    <span
                      className="w-3 h-3 rounded-full inline-block shrink-0 border"
                      style={{
                        backgroundColor:
                          teams?.find(
                            (t) => t.name.toLowerCase() === currentTeamValue.toLowerCase(),
                          )?.color || '#ccc',
                      }}
                    ></span>
                    <span className="truncate">
                      {teams?.find((t) => t.name.toLowerCase() === currentTeamValue.toLowerCase())
                        ?.name || currentTeamValue}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Takım</span>
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
            <p>Takım</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandEmpty>Takım bulunamadı.</CommandEmpty>
              <CommandGroup>
                {teams?.map((team) => (
                  <CommandItem key={team.id || team.name} value={team.name} onSelect={handleSelect}>
                    <div className="flex gap-2 justify-start items-center w-full">
                      <span
                        className="w-3 h-3 rounded-full inline-block border shrink-0"
                        style={{ backgroundColor: team?.color || '#ccc' }}
                      ></span>
                      <span>{team?.name}</span>
                    </div>
                    {currentTeamValue === team.name && (
                      <CheckIcon size={16} className="ml-auto shrink-0" />
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
