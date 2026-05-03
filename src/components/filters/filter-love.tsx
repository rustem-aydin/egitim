'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { filterSchema } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useOptimistic, useTransition } from 'react'
import { Filter } from '@/payload-types'
import { Heart, Star, Loader2 } from 'lucide-react'
import { saveFilter, getUserFilterByUrl } from '@/actions/filters'
import { toast } from 'sonner'
import { usePathname, useSearchParams } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const ROUTE_GROUPS: Record<string, string> = {
  '/lessons': 'Dersler',
  '/teams': 'Takımlar',
  '/groups': 'Gruplar',
  '/users': 'Kullanıcılar',
  '/experts': 'Uzmanlıklar',
  '/modules': 'Modules',
  '/drills': 'Tatbikatlar',
}

function getFilterGroup(pathname: string): string {
  const sortedRoutes = Object.keys(ROUTE_GROUPS).sort((a, b) => b.length - a.length)
  const matchedRoute = sortedRoutes.find((route) => pathname.startsWith(route))
  return matchedRoute ? ROUTE_GROUPS[matchedRoute] : 'Genel'
}

function buildFilterUrl(pathname: string, searchParams: URLSearchParams): string {
  const query = searchParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

type OptimisticFilter = Filter & { pending?: boolean; tempId?: string }

export function FilterLove() {
  const [open, setOpen] = React.useState(false)
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = React.useState(true)
  const [existingFilter, setExistingFilter] = React.useState<Filter | null>(null)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [savedFilters, setSavedFilters] = React.useState<OptimisticFilter[]>([])

  const [optimisticFilters, addOptimisticFilter] = useOptimistic(
    savedFilters,
    (currentState: OptimisticFilter[], newFilter: OptimisticFilter) => {
      return [...currentState, newFilter]
    },
  )

  const currentUrl = buildFilterUrl(pathname, searchParams)
  const currentGroup = getFilterGroup(pathname)

  React.useEffect(() => {
    async function checkExistingFilter() {
      setIsLoading(true)
      try {
        const filter = await getUserFilterByUrl(currentUrl)
        setExistingFilter(filter)
      } catch (error) {
        console.error('Filter check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingFilter()
  }, [currentUrl])

  const form = useForm<Filter>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      filter_url: currentUrl,
      filter_group: currentGroup,
      is_star: false,
      description: '',
    },
    mode: 'onChange',
  })

  React.useEffect(() => {
    form.reset({
      filter_url: currentUrl,
      filter_group: currentGroup,
      is_star: form.getValues('is_star') ?? false,
      description: form.getValues('description') ?? '',
    })
  }, [currentUrl, currentGroup])

  const isFilterSaved = React.useMemo(() => {
    const hasOptimistic = optimisticFilters.some((f) => f.filter_url === currentUrl && !f.pending)
    const hasExisting = existingFilter !== null
    return hasOptimistic || hasExisting
  }, [optimisticFilters, existingFilter, currentUrl])

  React.useEffect(() => {
    if (isFilterSaved && !isLoading) {
      setTooltipOpen(true)
    }
  }, [isFilterSaved])

  const handleFormSubmit = form.handleSubmit((data) => {
    const tempId = crypto.randomUUID()

    const optimisticFilter: OptimisticFilter = {
      ...data,
      id: tempId as unknown as number,
      pending: true,
      tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setOpen(false)

    form.reset({
      filter_url: currentUrl,
      filter_group: currentGroup,
      is_star: false,
      description: '',
    })

    startTransition(async () => {
      addOptimisticFilter(optimisticFilter)

      try {
        const result = await saveFilter(data)

        setSavedFilters((prev) =>
          prev.map((f) => (f.tempId === tempId ? { ...result, pending: false } : f)),
        )

        setExistingFilter(result)

        toast.success('Filtre başarıyla kaydedildi!')
      } catch (error) {
        console.error('Filtre kaydedilemedi:', error)
        toast.error('Filtre kaydedilemedi. Lütfen tekrar deneyin.')
        setSavedFilters((prev) => prev.filter((f) => f.tempId !== tempId))
      }
    })
  })

  const isSaving = optimisticFilters.some((f) => f.pending)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`
                  transition-all duration-500 ease-in-out
                  ${
                    isFilterSaved
                      ? 'text-red-500 border-red-200 hover:text-red-600 hover:border-red-300 hover:bg-red-50'
                      : 'text-muted-foreground hover:text-red-400 hover:border-red-100'
                  }
                `}
              disabled={isPending || isLoading || isFilterSaved}
            >
              <Heart
                className={`
                    transition-all duration-500 ease-in-out transform
                    ${isSaving ? 'animate-pulse scale-110' : ''}
                    ${isFilterSaved ? 'scale-100' : 'scale-90'}
                  `}
                fill={isFilterSaved ? 'currentColor' : 'none'}
                strokeWidth={isFilterSaved ? 2 : 1.5}
              />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="transition-opacity duration-300">
          <p className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Kontrol ediliyor...
              </>
            ) : isFilterSaved ? (
              <>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                Bu filtre kaydedildi
              </>
            ) : (
              'Filtreyi kaydet'
            )}
          </p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Filtre Kaydet</DialogTitle>
            </DialogHeader>

            {existingFilter && (
              <div className="rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800 animate-in fade-in slide-in-from-top-2 duration-500">
                Bu filtre zaten kaydedilmiş. Tekrar kaydetmek üzerine yazar.
              </div>
            )}

            <FormField
              control={form.control}
              name="filter_url"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Kaydedilecek URL
                  </label>
                  <div className="rounded-md bg-muted px-3 py-2 text-sm break-all font-mono">
                    {field.value}
                  </div>
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filter_group"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Kategori</label>
                  <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    {field.value}
                  </div>
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_star"
              render={({ field }) => (
                <FormItem>
                  <Button
                    type="button"
                    variant={field.value ? 'default' : 'outline'}
                    onClick={() => field.onChange(!field.value)}
                    className={
                      field.value
                        ? 'bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300'
                        : 'transition-colors duration-300'
                    }
                  >
                    <Star className={field.value ? 'fill-white' : ''} />
                    <span className="ml-2">{field.value ? 'Yıldızlı' : 'Yıldızla'}</span>
                  </Button>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium">Filtre Açıklaması</label>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Kaydetmek istediğiniz filtreye açıklama giriniz."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                      rows={3}
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  İptal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="transition-all duration-300"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : existingFilter ? (
                  'Güncelle'
                ) : (
                  'Ekle'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
