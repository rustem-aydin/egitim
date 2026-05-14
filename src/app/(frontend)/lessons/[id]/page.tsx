import { getLessonById } from '@/actions/lessons'
import MainDetails from '@/components/pages/lessons/details/main'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: number }>
}
const LessonDetailsePage = async ({ params }: Props) => {
  const id = (await params).id
  const lesson = await getLessonById(id)
  if (isNaN(id)) {
    notFound()
  }
  return <MainDetails lesson={lesson} />
}

export default LessonDetailsePage
