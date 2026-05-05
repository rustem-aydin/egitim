'use client'

import { useId, useMemo, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { format, parseISO, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { tr } from 'date-fns/locale'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '../ui/calender'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilterLevelsProps {
  startTransition: React.TransitionStartFunction
}

export default function FilterDate({ startTransition }: FilterLevelsProps) {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // 1. URL'den tarihleri al ve Date objesine çevir (Memoize ederek)
  const dateValue = useMemo(() => {
    const fromParam = searchParams.get('dateFrom')
    const toParam = searchParams.get('dateTo')

    const range: DateRange = {
      from: undefined,
      to: undefined,
    }

    if (fromParam) {
      const parsedFrom = parseISO(fromParam)
      if (isValid(parsedFrom)) range.from = parsedFrom
    }

    if (toParam) {
      const parsedTo = parseISO(toParam)
      if (isValid(parsedTo)) range.to = parsedTo
    }

    return range.from ? range : undefined
  }, [searchParams])

  // 2. Tarih seçildiğinde URL'i güncelle
  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedRange?.from) {
      // Timezone hatasını önlemek için doğrudan YYYY-MM-DD formatında kaydediyoruz
      params.set('dateFrom', format(selectedRange.from, 'yyyy-MM-dd'))

      if (selectedRange.to) {
        params.set('dateTo', format(selectedRange.to, 'yyyy-MM-dd'))
      } else {
        params.delete('dateTo')
      }
    } else {
      params.delete('dateFrom')
      params.delete('dateTo')
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const handleClearDate = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('dateFrom')
    params.delete('dateTo')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="*:not-first:mt-2 min-w-30">
      <div className="flex gap-2">
        <Popover>
          <Tooltip
            open={tooltipOpen || dateValue?.from !== undefined}
            onOpenChange={setTooltipOpen}
          >
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  id={id}
                  variant="outline"
                  className="group w-30 bg-background hover:bg-background border-input flex-1 justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                >
                  <span className={cn('truncate', !dateValue && 'text-muted-foreground')}>
                    {dateValue?.from ? (
                      dateValue.to ? (
                        <>
                          {format(dateValue.from, 'dd/MM/yyyy')} -{' '}
                          {format(dateValue.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateValue.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      'Tarih aralığı'
                    )}
                  </span>
                  <CalendarIcon
                    size={16}
                    className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tarih Aralığı </p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              className="w-auto"
              locale={tr}
              mode="range"
              selected={dateValue}
              onSelect={handleDateSelect}
              // Gelecek tarihler seçilemesin istenirse eklenebilir:
              // disabled={(date) => date > new Date()}
            />
            {dateValue && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDate}
                  className="w-full text-xs text-muted-foreground hover:text-destructive"
                >
                  Tarihi Sıfırla
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
