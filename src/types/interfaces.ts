import { TEventColor } from './types'

export interface IUser {
  id: string
  name: string
}

export interface IEvent {
  id: number
  startDate: string
  endDate: string
  title: string
  color: TEventColor
  description: string
  user: IUser
}

export interface ICalendarCell {
  day: number
  currentMonth: boolean
  date: Date
}
