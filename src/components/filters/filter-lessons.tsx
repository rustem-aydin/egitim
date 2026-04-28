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
import { Lesson } from '@/payload-types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilteLessonsProps {
  lessons: Lesson[]
  startTransition: React.TransitionStartFunction
}

export default function FilterLessons({ lessons, startTransition }: FilteLessonsProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentLessonValue = searchParams.get('lesson') || ''

  const [open, setOpen] = useState<boolean>(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleSelect = (selectedValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const selectedItem = lessons?.find(
      (l: any) => l.lesson_name.toLowerCase() === selectedValue.toLowerCase(),
    )
    const finalName = selectedItem?.name || selectedValue

    if (currentLessonValue === finalName) {
      params.delete('lesson')
    } else {
      params.set('lesson', finalName)
    }

    setOpen(false)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="*:not-first:mt-2 min-w-[200px]">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen || currentLessonValue !== ''} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                {currentLessonValue ? (
                  lessons?.find(
                    (l: any) => l.lesson_name.toLowerCase() === currentLessonValue.toLowerCase(),
                  )?.name || currentLessonValue
                ) : (
                  <span className="text-muted-foreground">Ders seçin...</span>
                )}
                <ChevronDownIcon
                  size={16}
                  className="text-muted-foreground/80 shrink-0 ml-2"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ders Seçin</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Ders ara..." />
            <CommandList className="max-h-[250px] overflow-y-auto scrollbar-thin">
              <CommandGroup>
                {lessons?.map((lesson: any) => (
                  <CommandItem key={lesson.id} value={lesson.lesson_name} onSelect={handleSelect}>
                    <div className="flex w-full items-center justify-between">
                      <span>{lesson.lesson_name}</span>
                    </div>
                    {currentLessonValue === lesson.lesson_name && (
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
