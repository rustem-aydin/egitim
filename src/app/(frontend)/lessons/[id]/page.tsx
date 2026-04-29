import { getLessonById } from '@/actions/server/lessons'
import LessonDetails from '@/components/pages/lessons/details/lesson-details'
import { notFound } from 'next/navigation'
interface Props {
  params: Promise<{ id: number }>
}
const LessonDetailsePage = async ({ params }: Props) => {
  const id = (await params).id
  const lesson = await getLessonById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <LessonDetails lesson={lesson} />
}

export default LessonDetailsePage
