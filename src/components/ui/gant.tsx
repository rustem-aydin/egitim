'use client'

import { useDraggable } from '@dnd-kit/core'
import { useMouse, useThrottle, useWindowScroll } from '@uidotdev/usehooks'
import {
  addDays,
  addMonths,
  addWeeks, // Eklendi
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks, // Eklendi
  endOfDay,
  endOfMonth,
  endOfWeek, // Eklendi
  format,
  formatDistance,
  getDaysInMonth,
  getISOWeek, // Eklendi
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek, // Eklendi
} from 'date-fns'
import { tr } from 'date-fns/locale'
import { atom, useAtom } from 'jotai'
import throttle from 'lodash.throttle'
import { PlusIcon, TrashIcon } from 'lucide-react'
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react'
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Card } from '@/components/ui/card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'

const draggingAtom = atom(false)
const scrollXAtom = atom(0)

export const useGanttDragging = () => useAtom(draggingAtom)
export const useGanttScrollX = () => useAtom(scrollXAtom)

export type GanttStatus = {
  id: string
  name: string
  color: string
}

export type GanttFeature = {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: GanttStatus
  lane?: string
}

export type GanttMarkerProps = {
  id: string
  date: Date
  label: string
}

// "weekly" seçeneği eklendi
export type Range = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export type TimelineData = {
  year: number
  quarters: {
    months: {
      days: number
    }[]
  }[]
}[]

export type GanttContextProps = {
  zoom: number
  range: Range
  columnWidth: number
  sidebarWidth: number
  headerHeight: number
  rowHeight: number
  onAddItem: ((date: Date) => void) | undefined
  placeholderLength: number
  timelineData: TimelineData
  ref: RefObject<HTMLDivElement | null> | null
  scrollToFeature?: (feature: GanttFeature) => void
}

// Helper Fonksiyonlar Güncellendi

const getsDaysIn = (range: Range) => {
  let fn = (_date: Date) => 1
  // Weekly için de 1 dönebiliriz veya özel mantık kurabiliriz,
  // ancak genel akışta monthly/quarterly özel durumdur.
  if (range === 'monthly' || range === 'quarterly') {
    fn = getDaysInMonth
  }
  return fn
}

const getDifferenceIn = (range: Range) => {
  let fn = differenceInDays
  if (range === 'weekly') {
    fn = (dateLeft: any, dateRight: any) => differenceInWeeks(dateLeft, dateRight)
  } else if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInMonths
  }
  return fn
}

const getInnerDifferenceIn = (range: Range) => {
  let fn = differenceInHours
  if (range === 'weekly') {
    fn = differenceInDays // Haftalık görünümde iç hassasiyet gün bazlı olsun
  } else if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInDays
  }
  return fn
}

const getStartOf = (range: Range) => {
  let fn = startOfDay
  if (range === 'weekly') {
    fn = (date: any) => startOfWeek(date, { locale: tr, weekStartsOn: 1 }) // Pazartesi başlar
  } else if (range === 'monthly' || range === 'quarterly') {
    fn = startOfMonth
  }
  return fn
}

const getEndOf = (range: Range) => {
  let fn = endOfDay
  if (range === 'weekly') {
    fn = (date: any) => endOfWeek(date, { locale: tr, weekStartsOn: 1 })
  } else if (range === 'monthly' || range === 'quarterly') {
    fn = endOfMonth
  }
  return fn
}

const getAddRange = (range: Range) => {
  let fn = addDays
  if (range === 'weekly') {
    fn = addWeeks
  } else if (range === 'monthly' || range === 'quarterly') {
    fn = addMonths
  }
  return fn
}

const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1)
  const columnWidth = (context.columnWidth * context.zoom) / 100
  const offset = Math.floor(mouseX / columnWidth)
  const addRange = getAddRange(context.range)

  // Temel üniteye göre tarihi bul (Gün, Hafta veya Ay)
  const unitDate = addRange(timelineStartDate, offset)

  if (context.range === 'daily') {
    return unitDate
  }

  // Haftalık veya Aylık için iç hassasiyet hesaplama
  const startOfRange = getStartOf(context.range)(unitDate)
  const pixelsPerUnit = columnWidth

  // Mouse'un kolon içindeki pozisyonu
  const innerPixelOffset = mouseX % columnWidth

  if (context.range === 'weekly') {
    // 1 hafta = 7 gün
    const daysOffset = Math.floor((innerPixelOffset / pixelsPerUnit) * 7)
    return addDays(startOfRange, daysOffset)
  } else {
    // Aylık/Çeyreklik
    const daysInMonth = getDaysInMonth(unitDate)
    const daysOffset = Math.floor((innerPixelOffset / pixelsPerUnit) * daysInMonth)
    return addDays(startOfRange, daysOffset)
  }
}

const createInitialTimelineData = (today: Date) => {
  const data: TimelineData = []
  data.push(
    { year: today.getFullYear() - 1, quarters: new Array(4).fill(null) },
    { year: today.getFullYear(), quarters: new Array(4).fill(null) },
    { year: today.getFullYear() + 1, quarters: new Array(4).fill(null) },
  )
  for (const yearObj of data) {
    yearObj.quarters = new Array(4).fill(null).map((_, quarterIndex) => ({
      months: new Array(3).fill(null).map((_, monthIndex) => {
        const month = quarterIndex * 3 + monthIndex
        return {
          days: getDaysInMonth(new Date(yearObj.year, month, 1)),
        }
      }),
    }))
  }
  return data
}

const getOffset = (date: Date, timelineStartDate: Date, context: GanttContextProps) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100
  const differenceIn = getDifferenceIn(context.range)
  const startOf = getStartOf(context.range)

  // Tam kolon sayısı (Kaç gün, kaç hafta veya kaç ay fark var?)
  const fullColumns = differenceIn(startOf(date), timelineStartDate)

  if (context.range === 'daily') {
    return parsedColumnWidth * fullColumns
  }

  // Kolon içi hassasiyet (Inner Offset)
  let partialRatio = 0

  if (context.range === 'weekly') {
    // Haftanın kaçıncı günü? (0-6 arası bir değer bulup 7'ye bölüyoruz)
    // Pazartesi(1) -> Pazar(0) dönüşümü için getDay() kullanımı tr locale ile dikkat ister.
    // Basit mantık: (date - startOfWeek) / 7
    const startOfWeekDate = startOf(date)
    const diffDays = differenceInDays(date, startOfWeekDate)
    partialRatio = diffDays / 7
  } else {
    // Aylık
    const dayOfMonth = date.getDate()
    const daysInMonth = getDaysInMonth(date)
    partialRatio = dayOfMonth / daysInMonth // Yaklaşık, tam matematik için (day-1) olabilir ama görsel olarak bu yeterli
  }

  return (fullColumns + partialRatio) * parsedColumnWidth
}

const getWidth = (startAt: Date, endAt: Date | null, context: GanttContextProps) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100

  if (!endAt) {
    return parsedColumnWidth * 2 // Varsayılan genişlik
  }

  const offsetStart = getOffset(startAt, new Date(0), context) // Referans tarihi önemsiz, fark alacağız
  const offsetEnd = getOffset(endAt, new Date(0), context)

  let width = offsetEnd - offsetStart

  // Eğer çok küçükse (aynı gün) minimum bir genişlik verelim
  if (width < 5) width = parsedColumnWidth / (context.range === 'daily' ? 1 : 30)

  return width
}

const calculateInnerOffset = (date: Date, range: Range, columnWidth: number) => {
  // getOffset fonksiyonu içinde halledildiği için burada 0 dönebiliriz
  // veya özel durumlar için kullanılabilir.
  // Mevcut yapıyı bozmamak adına:
  if (range === 'daily') return 0

  const startOf = getStartOf(range)
  const differenceIn = getInnerDifferenceIn(range)
  const startOfRange = startOf(date)

  // Geçen süre
  const diff = differenceIn(date, startOfRange)

  // Toplam süre kapasitesi
  let total = 1
  if (range === 'weekly')
    total = 7 // Gün
  else if (range === 'monthly' || range === 'quarterly') total = getDaysInMonth(date) // Gün

  return (diff / total) * columnWidth
}

const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: 'monthly',
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
})

export type GanttContentHeaderProps = {
  renderHeaderItem: (index: number) => ReactNode
  title: string
  columns: number
}

export const GanttContentHeader: FC<GanttContentHeaderProps> = ({
  title,
  columns,
  renderHeaderItem,
}) => {
  const id = useId()

  return (
    <div
      className="sticky top-0 z-20 grid w-full shrink-0 bg-backdrop/90 backdrop-blur-sm"
      style={{ height: 'var(--gantt-header-height)' }}
    >
      <div>
        <div
          className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs"
          style={{
            left: 'var(--gantt-sidebar-width)',
          }}
        >
          <p>{title}</p>
        </div>
      </div>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            className="shrink-0 border-border/50 border-b py-1 text-center text-xs"
            key={`${id}-${index}`}
          >
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  )
}

const DailyHeader: FC = () => {
  const gantt = useContext(GanttContext)

  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, index) => (
        <div className="relative flex flex-col" key={`${year.year}-${index}`}>
          <GanttContentHeader
            columns={month.days}
            renderHeaderItem={(item: number) => (
              <div className="flex items-center justify-center gap-1">
                <p>
                  {format(addDays(new Date(year.year, index, 1), item), 'd', {
                    locale: tr,
                  })}
                </p>
                <p className="text-muted-foreground">
                  {format(addDays(new Date(year.year, index, 1), item), 'EEEEE', { locale: tr })}
                </p>
              </div>
            )}
            title={format(new Date(year.year, index, 1), 'MMMM yyyy', {
              locale: tr,
            })}
          />
          <GanttColumns
            columns={month.days}
            isColumnSecondary={(item: number) =>
              [0, 6].includes(addDays(new Date(year.year, index, 1), item).getDay())
            }
          />
        </div>
      )),
  )
}

// --- YENİ EKLENEN HAFTALIK HEADER ---
const WeeklyHeader: FC = () => {
  const gantt = useContext(GanttContext)

  return gantt.timelineData.map((year) => {
    // O yıldaki toplam hafta sayısını kabaca hesapla veya o yılın başlangıcından sonuna kadar olan haftaları listele
    const startOfYearDate = new Date(year.year, 0, 1)
    const endOfYearDate = new Date(year.year, 11, 31)

    // Yılın başındaki ilk Pazartesi'den yılın sonuna kadar kaç hafta var?
    const weeksCount = differenceInWeeks(endOfYearDate, startOfYearDate) + 1 // +1 güvenlik payı

    return (
      <div className="relative flex flex-col" key={year.year}>
        <GanttContentHeader
          columns={weeksCount}
          renderHeaderItem={(item: number) => {
            const weekDate = addWeeks(startOfYearDate, item)
            const weekNumber = getISOWeek(weekDate)
            return (
              <div className="flex flex-col items-center justify-center">
                <p>H{weekNumber}</p>
                <span className="text-[10px] text-muted-foreground">
                  {format(startOfWeek(weekDate, { weekStartsOn: 1 }), 'd MMM', {
                    locale: tr,
                  })}
                </span>
              </div>
            )
          }}
          title={`${year.year}`}
        />
        <GanttColumns columns={weeksCount} />
      </div>
    )
  })
}
// ------------------------------------

const MonthlyHeader: FC = () => {
  const gantt = useContext(GanttContext)

  return gantt.timelineData.map((year) => (
    <div className="relative flex flex-col" key={year.year}>
      <GanttContentHeader
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
        renderHeaderItem={(item: number) => (
          <p>{format(new Date(year.year, item, 1), 'MMM', { locale: tr })}</p>
        )}
        title={`${year.year}`}
      />
      <GanttColumns columns={year.quarters.flatMap((quarter) => quarter.months).length} />
    </div>
  ))
}

const QuarterlyHeader: FC = () => {
  const gantt = useContext(GanttContext)

  return gantt.timelineData.map((year) =>
    year.quarters.map((quarter, quarterIndex) => (
      <div className="relative flex flex-col" key={`${year.year}-${quarterIndex}`}>
        <GanttContentHeader
          columns={quarter.months.length}
          renderHeaderItem={(item: number) => (
            <p>
              {format(new Date(year.year, quarterIndex * 3 + item, 1), 'MMM', {
                locale: tr,
              })}
            </p>
          )}
          title={`Ç${quarterIndex + 1} ${year.year}`}
        />
        <GanttColumns columns={quarter.months.length} />
      </div>
    )),
  )
}

const headers: Record<Range, FC> = {
  daily: DailyHeader,
  weekly: WeeklyHeader, // Weekly Eklendi
  monthly: MonthlyHeader,
  quarterly: QuarterlyHeader,
}

export type GanttHeaderProps = {
  className?: string
}

export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useContext(GanttContext)
  const Header = headers[gantt.range]

  return (
    <div className={cn('-space-x-px flex h-full w-max divide-x divide-border/50', className)}>
      <Header />
    </div>
  )
}

export type GanttSidebarItemProps = {
  feature: GanttFeature
  onSelectItem?: (id: string) => void
  className?: string
}

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const gantt = useContext(GanttContext)
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt
  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt, { locale: tr })
    : `${formatDistance(feature.startAt, new Date(), {
        locale: tr,
      })} şu ana kadar`

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      gantt.scrollToFeature?.(feature)
      onSelectItem?.(feature.id)
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      gantt.scrollToFeature?.(feature)
      onSelectItem?.(feature.id)
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary',
        className,
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        height: 'var(--gantt-row-height)',
      }}
      tabIndex={0}
    >
      <div
        className="pointer-events-none h-2 w-2 shrink-0 rounded-full"
        style={{
          backgroundColor: feature.status.color,
        }}
      />
      <p className="pointer-events-none flex-1 truncate text-left font-medium">{feature.name}</p>
      <p className="pointer-events-none text-muted-foreground">{duration}</p>
    </div>
  )
}

export const GanttSidebarHeader: FC = () => (
  <div
    className="sticky top-0 z-10 flex shrink-0 items-end justify-between gap-2.5 border-border/50 border-b bg-backdrop/90 p-2.5 font-medium text-muted-foreground text-xs backdrop-blur-sm"
    style={{ height: 'var(--gantt-header-height)' }}
  >
    <p className="flex-1 truncate text-left">Görevler</p>
    <p className="shrink-0">Süre</p>
  </div>
)

export type GanttSidebarGroupProps = {
  children: ReactNode
  name: string
  className?: string
}

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({ children, name, className }) => (
  <div className={className}>
    <p
      className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs"
      style={{ height: 'var(--gantt-row-height)' }}
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
)

export type GanttSidebarProps = {
  children: ReactNode
  className?: string
}

export const GanttSidebar: FC<GanttSidebarProps> = ({ children, className }) => (
  <div
    className={cn(
      'sticky left-0 z-30 h-max min-h-full overflow-clip border-border/50 border-r bg-background/90 backdrop-blur-md',
      className,
    )}
    data-roadmap-ui="gantt-sidebar"
  >
    <GanttSidebarHeader />
    <div className="space-y-4">{children}</div>
  </div>
)

export type GanttAddFeatureHelperProps = {
  top: number
  className?: string
}

export const GanttAddFeatureHelper: FC<GanttAddFeatureHelperProps> = ({ top, className }) => {
  const [scrollX] = useGanttScrollX()
  const gantt = useContext(GanttContext)
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>()

  const handleClick = () => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect()
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth
    const currentDate = getDateByMousePosition(gantt, x)

    gantt.onAddItem?.(currentDate)
  }

  return (
    <div
      className={cn('absolute top-0 w-full px-0.5', className)}
      ref={mouseRef}
      style={{
        marginTop: -gantt.rowHeight / 2,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        className="flex h-full w-full items-center justify-center rounded-md border border-dashed p-2"
        onClick={handleClick}
        type="button"
      >
        <PlusIcon className="pointer-events-none select-none text-muted-foreground" size={16} />
      </button>
    </div>
  )
}

export type GanttColumnProps = {
  index: number
  isColumnSecondary?: (item: number) => boolean
}

export const GanttColumn: FC<GanttColumnProps> = ({ index, isColumnSecondary }) => {
  const gantt = useContext(GanttContext)
  const [dragging] = useGanttDragging()
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>()
  const [hovering, setHovering] = useState(false)
  const [windowScroll] = useWindowScroll()

  const handleMouseEnter = () => setHovering(true)
  const handleMouseLeave = () => setHovering(false)

  const top = useThrottle(
    mousePosition.y - (mouseRef.current?.getBoundingClientRect().y ?? 0) - (windowScroll.y ?? 0),
    10,
  )

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden',
        isColumnSecondary?.(index) ? 'bg-secondary' : '',
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={mouseRef}
    >
      {!dragging && hovering && gantt.onAddItem ? <GanttAddFeatureHelper top={top} /> : null}
    </div>
  )
}

export type GanttColumnsProps = {
  columns: number
  isColumnSecondary?: (item: number) => boolean
}

export const GanttColumns: FC<GanttColumnsProps> = ({ columns, isColumnSecondary }) => {
  const id = useId()

  return (
    <div
      className="divide grid h-full w-full divide-x divide-border/50"
      style={{
        gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <GanttColumn index={index} isColumnSecondary={isColumnSecondary} key={`${id}-${index}`} />
      ))}
    </div>
  )
}

export type GanttCreateMarkerTriggerProps = {
  onCreateMarker: (date: Date) => void
  className?: string
}

export const GanttCreateMarkerTrigger: FC<GanttCreateMarkerTriggerProps> = ({
  onCreateMarker,
  className,
}) => {
  const gantt = useContext(GanttContext)
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>()
  const [windowScroll] = useWindowScroll()
  const x = useThrottle(
    mousePosition.x - (mouseRef.current?.getBoundingClientRect().x ?? 0) - (windowScroll.x ?? 0),
    10,
  )

  const date = getDateByMousePosition(gantt, x)

  const handleClick = () => onCreateMarker(date)

  return (
    <div
      className={cn(
        'group pointer-events-none absolute top-0 left-0 h-full w-full select-none overflow-visible',
        className,
      )}
      ref={mouseRef}
    >
      <div
        className="-ml-2 pointer-events-auto sticky top-6 z-20 flex w-4 flex-col items-center justify-center gap-1 overflow-visible opacity-0 group-hover:opacity-100"
        style={{ transform: `translateX(${x}px)` }}
      >
        <button
          className="z-50 inline-flex h-4 w-4 items-center justify-center rounded-full bg-card"
          onClick={handleClick}
          type="button"
        >
          <PlusIcon className="text-muted-foreground" size={12} />
        </button>
        <div className="whitespace-nowrap rounded-full border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg">
          {format(date, 'd MMM yyyy', { locale: tr })}
        </div>
      </div>
    </div>
  )
}

export type GanttFeatureItemCardProps = Pick<GanttFeature, 'id'> & {
  children?: ReactNode
}

export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps> = ({ id, children }) => {
  const [, setDragging] = useGanttDragging()
  const { attributes, listeners, setNodeRef } = useDraggable({ id })
  const isPressed = Boolean(attributes['aria-pressed'])

  useEffect(() => setDragging(isPressed), [isPressed, setDragging])

  return (
    <Card className="h-full w-full rounded-md bg-background p-1 text-xs shadow-sm">
      <div
        className={cn(
          'flex h-full w-full items-center justify-between gap-2 text-left',
          isPressed && 'cursor-grabbing',
        )}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  )
}

export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void
  children?: ReactNode
  className?: string
}

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  children,
  className,
  ...feature
}) => {
  const [] = useGanttScrollX()
  const gantt = useContext(GanttContext)
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData],
  )

  const startAt = feature.startAt
  const endAt = feature.endAt

  const width = useMemo(() => getWidth(startAt, endAt, gantt), [startAt, endAt, gantt])
  const offset = useMemo(
    () => getOffset(startAt, timelineStartDate, gantt),
    [startAt, timelineStartDate, gantt],
  )

  return (
    <div
      className={cn('relative flex w-max min-w-full py-0.5', className)}
      style={{ height: 'var(--gantt-row-height)' }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: 'calc(var(--gantt-row-height) - 4px)',
          width: Math.round(width),
          left: Math.round(offset),
        }}
      >
        <Card className="h-full w-full rounded-md bg-background p-2 text-xs shadow-sm">
          <div className="flex h-full w-full items-center justify-between gap-2 text-left">
            {children ?? <p className="flex-1 truncate text-xs">{feature.name}</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

export type GanttFeatureListGroupProps = {
  children: ReactNode
  className?: string
}

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({ children, className }) => (
  <div className={className} style={{ paddingTop: 'var(--gantt-row-height)' }}>
    {children}
  </div>
)

export type GanttFeatureRowProps = {
  features: GanttFeature[]
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void
  children?: (feature: GanttFeature) => ReactNode
  className?: string
}

export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({
  features,
  onMove,
  children,
  className,
}) => {
  const sortedFeatures = [...features].sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

  const featureWithPositions = []
  const subRowEndTimes: Date[] = []

  for (const feature of sortedFeatures) {
    let subRow = 0
    while (subRow < subRowEndTimes.length && subRowEndTimes[subRow] > feature.startAt) {
      subRow++
    }

    if (subRow === subRowEndTimes.length) {
      subRowEndTimes.push(feature.endAt)
    } else {
      subRowEndTimes[subRow] = feature.endAt
    }

    featureWithPositions.push({ ...feature, subRow })
  }

  const maxSubRows = Math.max(1, subRowEndTimes.length)
  const subRowHeight = 36

  return (
    <div
      className={cn('relative', className)}
      style={{
        height: `${maxSubRows * subRowHeight}px`,
        minHeight: 'var(--gantt-row-height)',
      }}
    >
      {featureWithPositions.map((feature) => (
        <div
          className="absolute w-full"
          key={feature.id}
          style={{
            top: `${feature.subRow * subRowHeight}px`,
            height: `${subRowHeight}px`,
          }}
        >
          <GanttFeatureItem {...feature} onMove={onMove}>
            {children ? (
              children(feature)
            ) : (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItem>
        </div>
      ))}
    </div>
  )
}

export type GanttFeatureListProps = {
  className?: string
  children: ReactNode
}

export const GanttFeatureList: FC<GanttFeatureListProps> = ({ className, children }) => (
  <div
    className={cn('absolute top-0 left-0 h-full w-max space-y-4', className)}
    style={{ marginTop: 'var(--gantt-header-height)' }}
  >
    {children}
  </div>
)

export const GanttMarker: FC<
  GanttMarkerProps & {
    onRemove?: (id: string) => void
    className?: string
  }
> = memo(({ label, date, id, onRemove, className }) => {
  const gantt = useContext(GanttContext)
  const differenceIn = useMemo(() => getDifferenceIn(gantt.range), [gantt.range])
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData],
  )

  const offset = useMemo(
    () => getOffset(date, timelineStartDate, gantt), // getOffset kullanarak merkezileştirdim
    [date, timelineStartDate, gantt],
  )

  const handleRemove = useCallback(() => onRemove?.(id), [onRemove, id])

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(${offset}px)`, // Direkt offset kullanımı
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
              className,
            )}
          >
            {label}
            <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
              {format(date, 'd MMM yyyy', { locale: tr })}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {onRemove ? (
            <ContextMenuItem
              className="flex items-center gap-2 text-destructive"
              onClick={handleRemove}
            >
              <TrashIcon size={16} />
              İşaretleyiciyi kaldır
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  )
})

GanttMarker.displayName = 'GanttMarker'

export type GanttProviderProps = {
  range?: Range
  zoom?: number
  onAddItem?: (date: Date) => void
  children: ReactNode
  className?: string
}

export const GanttProvider: FC<GanttProviderProps> = ({
  zoom = 100,
  range = 'monthly',
  onAddItem,
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(new Date()),
  )
  const [, setScrollX] = useGanttScrollX()
  const [sidebarWidth, setSidebarWidth] = useState(0)

  const [isPanning, setIsPanning] = useState(false)
  const panRef = useRef({ isPanning: false, startX: 0, scrollLeft: 0 })

  const headerHeight = 60
  const rowHeight = 36
  let columnWidth = 50

  if (range === 'monthly') {
    columnWidth = 150
  } else if (range === 'quarterly') {
    columnWidth = 100
  } else if (range === 'weekly') {
    columnWidth = 120 // Haftalık görünüm için sütun genişliği
  }

  const cssVariables = useMemo(
    () =>
      ({
        '--gantt-zoom': `${zoom}`,
        '--gantt-column-width': `${(zoom / 100) * columnWidth}px`,
        '--gantt-header-height': `${headerHeight}px`,
        '--gantt-row-height': `${rowHeight}px`,
        '--gantt-sidebar-width': `${sidebarWidth}px`,
      }) as CSSProperties,
    [zoom, columnWidth, sidebarWidth],
  )

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2
      setScrollX(scrollRef.current.scrollLeft)
    }
  }, [setScrollX])

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebarElement = scrollRef.current?.querySelector('[data-roadmap-ui="gantt-sidebar"]')
      const newWidth = sidebarElement ? 300 : 0
      setSidebarWidth(newWidth)
    }

    updateSidebarWidth()

    const observer = new MutationObserver(updateSidebarWidth)
    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleScroll = useCallback(
    throttle(() => {
      const scrollElement = scrollRef.current
      if (!scrollElement) {
        return
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollElement
      setScrollX(scrollLeft)

      if (scrollLeft === 0) {
        const firstYear = timelineData[0]?.year

        if (!firstYear) {
          return
        }

        const newTimelineData: TimelineData = [...timelineData]
        newTimelineData.unshift({
          year: firstYear - 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex
              return {
                days: getDaysInMonth(new Date(firstYear, month, 1)),
              }
            }),
          })),
        })

        setTimelineData(newTimelineData)

        scrollElement.scrollLeft = scrollElement.clientWidth
        setScrollX(scrollElement.scrollLeft)
      } else if (scrollLeft + clientWidth >= scrollWidth) {
        const lastYear = timelineData.at(-1)?.year

        if (!lastYear) {
          return
        }

        const newTimelineData: TimelineData = [...timelineData]
        newTimelineData.push({
          year: lastYear + 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex
              return {
                days: getDaysInMonth(new Date(lastYear, month, 1)),
              }
            }),
          })),
        })

        setTimelineData(newTimelineData)

        scrollElement.scrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth
        setScrollX(scrollElement.scrollLeft)
      }
    }, 100),
    [],
  )

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const scrollToFeature = useCallback(
    (feature: GanttFeature) => {
      const scrollElement = scrollRef.current
      if (!scrollElement) {
        return
      }

      const timelineStartDate = new Date(timelineData[0].year, 0, 1)

      const offset = getOffset(feature.startAt, timelineStartDate, {
        zoom,
        range,
        columnWidth,
        sidebarWidth,
        headerHeight,
        rowHeight,
        onAddItem,
        placeholderLength: 2,
        timelineData,
        ref: scrollRef,
      })

      const targetScrollLeft = Math.max(0, offset)

      scrollElement.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      })
    },
    [timelineData, zoom, range, columnWidth, sidebarWidth, onAddItem],
  )

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    panRef.current.isPanning = true
    panRef.current.startX = e.pageX - scrollRef.current.offsetLeft
    panRef.current.scrollLeft = scrollRef.current.scrollLeft
    setIsPanning(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!panRef.current.isPanning || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - panRef.current.startX) * 1
    scrollRef.current.scrollLeft = panRef.current.scrollLeft - walk
  }

  const onMouseUp = () => {
    panRef.current.isPanning = false
    setIsPanning(false)
  }

  const onMouseLeave = () => {
    panRef.current.isPanning = false
    setIsPanning(false)
  }

  return (
    <GanttContext.Provider
      value={{
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature,
      }}
    >
      <div
        className={cn(
          'gantt relative isolate grid h-full w-full flex-none select-none overflow-auto rounded-sm bg-secondary',
          range,
          isPanning ? 'cursor-grabbing' : 'cursor-grab',
          className,
        )}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          ...cssVariables,
          gridTemplateColumns: 'var(--gantt-sidebar-width) 1fr',
        }}
      >
        {children}
      </div>
    </GanttContext.Provider>
  )
}

export type GanttTimelineProps = {
  children: ReactNode
  className?: string
}

export const GanttTimeline: FC<GanttTimelineProps> = ({ children, className }) => (
  <div className={cn('relative flex h-full w-max flex-none overflow-clip', className)}>
    {children}
  </div>
)

export type GanttTodayProps = {
  className?: string
}

export const GanttToday: FC<GanttTodayProps> = ({ className }) => {
  const label = 'Bugün'
  const date = useMemo(() => new Date(), [])
  const gantt = useContext(GanttContext)
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData],
  )

  const offset = useMemo(
    () => getOffset(date, timelineStartDate, gantt), // Merkezi fonksiyon kullanımı
    [date, timelineStartDate, gantt],
  )

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(${offset}px)`,
      }}
    >
      <div
        className={cn(
          'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
          className,
        )}
      >
        {label}
        <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
          {format(date, 'd MMM yyyy', { locale: tr })}
        </span>
      </div>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  )
}
