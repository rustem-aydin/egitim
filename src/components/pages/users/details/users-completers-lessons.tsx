import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lesson, User } from '@/payload-types'
import MiniLessonCard from '../../lessons/mini-lesson-card'

const UserCompletersLessons = ({ user }: { user: User }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tamamlanan Dersler</CardTitle>
        <CardDescription>Personelin Tamamladığı dersler</CardDescription>
      </CardHeader>
      <CardContent style={{ maxHeight: 280, overflowY: 'auto' }}>
        {(user?.lessons as Lesson[]).map((lesson) => {
          return <MiniLessonCard key={lesson.id} lesson={lesson} />
        })}
      </CardContent>
    </Card>
  )
}

export default UserCompletersLessons
