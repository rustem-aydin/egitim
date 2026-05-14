import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lesson, User } from '@/payload-types'
import MiniLessonCard from '../../lessons/mini-lesson-card'

const UserCompletersLessons = ({ user }: { user: User }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle>Tamamlanan Dersler</CardTitle>
        <CardDescription>Personelin Tamamladığı dersler</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto min-h-0">
        {(user?.lessons as Lesson[]).map((lesson) => {
          return <MiniLessonCard key={lesson.id} lesson={lesson} />
        })}
      </CardContent>
    </Card>
  )
}

export default UserCompletersLessons
