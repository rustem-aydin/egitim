'use client'

import { Reorder } from 'framer-motion'
import {
  GripVertical,
  Star,
  Heart,
  Trash2,
  Loader2,
  Link2,
  Link2Icon,
  LinkIcon,
} from 'lucide-react'
import { useState, useEffect, useCallback, useOptimistic, useTransition } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Filter } from '@/payload-types'
import {
  getUserFilters,
  deleteFilter,
  toggleFilterStar,
  updateFiltersOrder,
} from '@/actions/filters'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from './ui/popover'

const GROUP_COLORS: Record<string, string> = {
  Dersler: 'bg-blue-100 text-blue-700 border-blue-200',
  Takımlar: 'bg-green-100 text-green-700 border-green-200',
  Öğrenciler: 'bg-purple-100 text-purple-700 border-purple-200',
  Öğretmenler: 'bg-orange-100 text-orange-700 border-orange-200',
  Değerlendirmeler: 'bg-pink-100 text-pink-700 border-pink-200',
  Raporlar: 'bg-gray-100 text-gray-700 border-gray-200',
  Genel: 'bg-slate-100 text-slate-700 border-slate-200',
}

function getGroupColor(group: string): string {
  return GROUP_COLORS[group] || GROUP_COLORS.Genel
}

interface FilterSheetProps {
  children: React.ReactNode
}

export function FilterSheet({ children }: FilterSheetProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [items, setItems] = useState<Filter[]>([])

  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    items,
    (currentState: Filter[], newOrder: Filter[]) => {
      return newOrder
    },
  )

  const loadFilters = useCallback(async () => {
    setIsLoading(true)
    try {
      const filters = await getUserFilters()
      setItems(filters)
    } catch (error) {
      toast.error('Filtreler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadFilters()
    }
  }, [open, loadFilters])

  const handleReorder = (newOrder: Filter[]) => {
    // Tüm optimistic update + server action tek bir transition içinde
    startTransition(async () => {
      // 1. Optimistic olarak UI'ı hemen güncelle
      updateOptimisticItems(newOrder)

      try {
        const updates = newOrder.map((item, index) => ({
          id: item.id,
          order: index,
        }))

        await updateFiltersOrder(updates)

        // Başarılı olursa gerçek state'i güncelle
        setItems(newOrder)
        toast.success('Sıralama kaydedildi')
      } catch {
        toast.error('Sıralama kaydedilemedi')
        // Hata durumunda: setItems çağrılmadığı için
        // items değişmez, optimistic otomatik rollback olur
      }
    })
  }

  const handleToggleStar = (id: number, currentStar: boolean | null) => {
    const updatedItems = optimisticItems.map((item) =>
      item.id === id ? { ...item, is_star: !currentStar } : item,
    )

    startTransition(async () => {
      updateOptimisticItems(updatedItems)

      try {
        await toggleFilterStar(id, !!currentStar)
        setItems(updatedItems)
        toast.success(currentStar ? 'Yıldız kaldırıldı' : 'Yıldız eklendi')
      } catch {
        toast.error('İşlem başarısız')
      }
    })
  }

  const handleDelete = (id: number) => {
    const filteredItems = optimisticItems.filter((item) => item.id !== id)

    startTransition(async () => {
      updateOptimisticItems(filteredItems)

      try {
        await deleteFilter(id)
        setItems(filteredItems)
        toast.success('Filtre silindi')
      } catch {
        toast.error('Silme işlemi başarısız')
      }
    })
  }

  const navigateToFilter = (url: string) => {
    window.location.href = url
  }
  const router = useRouter()
  const handleRemote = (url: string) => {
    router.push(url)
    setOpen(false)
  }
  const displayItems = optimisticItems.length > 0 ? optimisticItems : items

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="w-full min-w-120 px-2 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Kaydedilen Filtreler
            {displayItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {displayItems.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Heart className="h-12 w-12 mb-4 opacity-20" />
              <p>Henüz kaydedilmiş filtre yok</p>
              <p className="text-sm mt-1">Filtreleri kaydetmek için kalp butonunu kullanın</p>
            </div>
          ) : (
            <>
              {isPending && (
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Değişiklikler kaydediliyor...
                </div>
              )}
              <Reorder.Group
                axis="y"
                values={displayItems}
                onReorder={handleReorder}
                className="space-y-3"
              >
                {displayItems.map((item) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className="group relative"
                    whileDrag={{ scale: 1.02, zIndex: 50 }}
                  >
                    <div className="flex cursor-grab items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing">
                      <div className="mt-1 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="outline"
                            className={`${getGroupColor(item.filter_group || 'Genel')} text-xs font-medium`}
                          >
                            {item.filter_group || 'Genel'}
                          </Badge>

                          <div className="flex items-center ">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemote(item?.filter_url)}
                            >
                              <LinkIcon className={`h-4 w-4 transition-all duration-300 `} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleStar(item.id, item.is_star ?? false)
                              }}
                            >
                              <Star
                                className={`h-4 w-4 transition-all duration-300 ${
                                  item.is_star
                                    ? 'fill-yellow-400 text-yellow-400 scale-110'
                                    : 'text-muted-foreground/50 hover:text-yellow-400'
                                }`}
                              />
                            </Button>
                            <Popover modal>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground/50 hover:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56">
                                <PopoverHeader>Sİlmek İstiyormusunuz</PopoverHeader>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-full text-muted-foreground/50 hover:text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(item.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="">Sil</span>
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
