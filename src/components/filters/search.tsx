'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useDebounce } from '../ui/multiselect'

interface SearchSelectProps {
  startTransition: React.TransitionStartFunction
}

export default function SearchInput({ startTransition }: SearchSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const currentUrlValue = params.get('search') || ''

    if (debouncedSearchTerm === currentUrlValue) return

    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm)
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }, [debouncedSearchTerm, pathname, router])

  useEffect(() => {
    const urlValue = searchParams.get('search') || ''

    if (urlValue !== debouncedSearchTerm) {
      setSearchTerm(urlValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="relative w-48">
      <Tooltip
        delayDuration={searchTerm !== '' ? 0 : 500}
        open={tooltipOpen || searchTerm !== ''}
        onOpenChange={setTooltipOpen}
      >
        <TooltipTrigger asChild>
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="search-input"
              type="text"
              placeholder="Aramak için yazın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 bg-background "
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Arama Yapın</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
