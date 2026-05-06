'use client'
import MotionCard from '../../motion-card'
import { Lesson } from '@/payload-types'
import { getStatusLessonColor } from './lessons-color'
import Link from 'next/link'

const MiniLessonCard = ({ lesson }: { lesson: Lesson }) => {
  return (
    <MotionCard key={lesson?.id}>
      <div className="group relative w-full mb-1  transform shadow-sm rounded-xl bg-sidebar h-full transition-all duration-500">
        <div
          className={`absolute w-full -inset-1 ${getStatusLessonColor(String(lesson?.status))} rounded-2xl blur opacity-20 transition duration-1000`}
        />
        <div className="relative  rounded-lg overflow-hidden">
          <div
            className={`relative p-2  bg-linear-to-r ${getStatusLessonColor(String(lesson?.status))} overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            <div className="flex flex-row justify-between">
              <div className="relative z-10  w-10">
                <Link
                  href={`/lessons/${lesson?.id}`}
                  className="text-sm truncate sm:text-sm font-bold"
                >
                  {lesson?.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionCard>
  )
}

export default MiniLessonCard
