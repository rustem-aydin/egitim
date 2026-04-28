// components/lessons/lessons-list.tsx

import { NotFoundItem } from '@/components/not-found-item'
import { Lesson } from '@/payload-types'
import LessonsCard from '../../lesson-card'
import LoadMoreButton from '@/components/load-more-button'

const LessonsList = async ({
  lessons,
  currentPage,
  hasNextPage,
}: {
  lessons: Lesson[]
  currentPage?: number
  hasNextPage?: boolean
}) => {
  if (!lessons.length && currentPage === 1) {
    return <NotFoundItem title="Ders Bulunamadı" description="" />
  }
  return (
    <div className=" relative z-10 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 pt-4 gap-6">
        {lessons.map((lesson: Lesson) => (
          <LessonsCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
      {hasNextPage && currentPage && <LoadMoreButton nextPage={currentPage + 1} />}
    </div>
  )
}

export default LessonsList
