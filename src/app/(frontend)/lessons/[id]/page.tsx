import { getLessonById } from '@/actions/lessons'
import LessonDetails from '@/components/pages/lessons/details/lesson-details'
import LessonSwappy from '@/components/pages/lessons/swappy/main'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: number }>
}
const LessonDetailsePage = async ({ params }: Props) => {
  const id = (await params).id
  const lesson = await getLessonById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <LessonSwappy lesson={lesson} />
}

export default LessonDetailsePage
