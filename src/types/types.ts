export type TCalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda'
export type TEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'
export type TBadgeVariant = 'dot' | 'colored' | 'mixed'
export type TWorkingHours = { [key: number]: { from: number; to: number } }
export type TVisibleHours = { from: number; to: number }

export type TeamBasicDetailsData = {
  id: number
  name: string
  color: string
  memberCount: number
  users?: any[]
  groups: any[]
  requiredModules: any[]
}

import { Lesson } from '@/payload-types'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  title: string
  description?: string
  icon?: LucideIcon
  content?: ReactNode
  cardContent?: ReactNode
  color: string // Örn: "bg-blue-500 hover:bg-blue-600"
}

export interface SmoothTabProps {
  items?: TabItem[]
  defaultTabId?: string
  className?: string
  activeColor?: string
  onChange?: (tabId: string) => void
}

export interface SortOption {
  value: string
  label: string
}
export interface LayoutOption {
  value: string
  label: string
}
export interface LessonsProps {
  lessons: Lesson[]
}

export interface SwappyProps {
  id: string
  title: string
  widgets: React.ReactNode
  className?: string
}
