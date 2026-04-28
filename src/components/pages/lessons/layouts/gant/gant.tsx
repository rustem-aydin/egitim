'use client'

import * as React from 'react'
import { groupBy } from 'lodash'
import { TrashIcon } from 'lucide-react'
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureItem,
  GanttToday,
  GanttFeature,
  Range,
} from '@/components/ui/gant'

import { Card } from '@/components/ui/card'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Drill, DrillGroup, Lesson, Module } from '@/payload-types'

// Gantt chart beklediği tip
type GanttItemWithGroup = GanttFeature & { groupName: string }

// Status'e göre renk belirle
function getStatusColor(status: string | null): string {
  switch (status) {
    case 'Taslak':
      return '#6b7280'
    case 'Planlanıyor':
      return '#3b82f6'
    case 'İşleme Alındı':
      return '#f59e0b'
    case 'Tamamlandı':
      return '#22c55e'
    default:
      return 'var(--chart-2)'
  }
}

// Ham veriyi Gantt formatına dönüştüren fonksiyon
function transformToGanttData(lessons: Lesson[], drills: Drill[]): GanttItemWithGroup[] {
  // Dersleri Gantt formatına dönüştür
  const lessonItems: GanttItemWithGroup[] = lessons
    .filter((lesson) => lesson.date_from && lesson.date_to)
    .map((lesson) => {
      const moduleName = (lesson.module as Module)?.name || 'Genel'
      const groupName = `${moduleName} - Dersler`

      return {
        id: `lesson-${lesson.id}`,
        name: lesson.name,
        startAt: new Date(lesson.date_from!),
        endAt: new Date(lesson.date_to!),
        status: {
          id: lesson.status?.toLowerCase() || 'taslak',
          name: lesson.status || 'Taslak',
          color: getStatusColor(lesson.status),
        },
        groupName: groupName,
      }
    })

  // Tatbikatları Gantt formatına dönüştür
  const drillItems: GanttItemWithGroup[] = drills
    .filter((drill) => drill.date_from && drill.date_to)
    .map((drill) => {
      const groupName = (drill.group as DrillGroup)?.name
        ? `${(drill.group as DrillGroup).name} - Tatbikatlar`
        : 'Genel - Tatbikatlar'

      return {
        id: `drill-${drill.id}`,
        name: drill.name,
        // DÜZELTME: String gelen tarihleri Date objesine çevirdik
        startAt: new Date(drill.date_from!),
        endAt: new Date(drill.date_to!),
        status: {
          id: 'tatbikat',
          name: 'Tatbikat',
          color: 'var(--chart-4)',
        },
        groupName: groupName,
      }
    })

  return [...lessonItems, ...drillItems].sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
}

interface CategoryGanttChartProps {
  lessons: Lesson[]
  drills: Drill[]
  isLoading?: boolean
  error?: Error | null
}

export function CategoryGanttChart({
  lessons,
  drills,
  isLoading = false,
  error = null,
}: CategoryGanttChartProps) {
  const [range, setRange] = React.useState<Range>('monthly')

  // Gantt verisini memoize et (performans için)
  const ganttData = React.useMemo(() => {
    return transformToGanttData(lessons, drills)
  }, [lessons, drills])

  const [ganttItems, setGanttItems] = React.useState<GanttItemWithGroup[]>([])

  React.useEffect(() => {
    setGanttItems(ganttData)
  }, [ganttData])

  const groupedItems = groupBy(ganttItems, 'groupName')
  const sortedGroupedItems = Object.fromEntries(
    Object.entries(groupedItems).sort(([nameA], [nameB]) => nameA.localeCompare(nameB)),
  )

  const handleRemoveItem = (id: string) =>
    setGanttItems((prev) => prev.filter((item) => item.id !== id))

  const handleMoveItem = (id: string, startAt: Date, endAt: Date | null) => {
    setGanttItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, startAt, endAt: endAt || startAt } : item)),
    )
  }

  return (
    <Card className="p-4 max-w-395 mt-2">
      <GanttProvider range={range} zoom={50}>
        <GanttSidebar className="">
          <ButtonGroup className="justify-center items-center">
            <Button
              onClick={() => setRange('daily')}
              className="max-w-20"
              variant={range === 'daily' ? 'default' : 'outline'}
            >
              Günlük
            </Button>
            <Button
              onClick={() => setRange('weekly')}
              className="max-w-20"
              variant={range === 'weekly' ? 'default' : 'outline'}
            >
              Haftalık
            </Button>
            <Button
              onClick={() => setRange('monthly')}
              className="max-w-20"
              variant={range === 'monthly' ? 'default' : 'outline'}
            >
              Aylık
            </Button>
            <Button
              onClick={() => setRange('quarterly')}
              className="max-w-20"
              variant={range === 'quarterly' ? 'default' : 'outline'}
            >
              Çeyrek
            </Button>
          </ButtonGroup>
          {Object.entries(sortedGroupedItems).map(([groupName, items]) => (
            <GanttSidebarGroup key={groupName} name={groupName}>
              {items.map((item) => (
                <GanttSidebarItem key={item.id} feature={item} />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {Object.entries(sortedGroupedItems).map(([groupName, items]) => (
              <GanttFeatureListGroup key={groupName}>
                {items.map((item) => (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger asChild>
                      <GanttFeatureItem {...item} onMove={handleMoveItem}>
                        <div
                          className="flex h-full w-full items-center p-2 text-xs"
                          style={{
                            backgroundColor: item.status.color,
                            color: 'white',
                          }}
                        >
                          <p className="flex-1 truncate">{item.name}</p>
                        </div>
                      </GanttFeatureItem>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <TrashIcon size={16} className="mr-2" /> Kaldır
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          <GanttToday />
        </GanttTimeline>
      </GanttProvider>
    </Card>
  )
}
