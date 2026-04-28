import { getAllLessonsAction } from '@/actions/server/lessons'
import { CalendarProvider } from './calender-context'

export default async function CalenderLayout({ children }: { children: React.ReactNode }) {
  const events = await getAllLessonsAction()

  return <CalendarProvider events={events || []}>{children}</CalendarProvider>
}
