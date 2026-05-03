'use client'
import DetailLink from '@/components/detail-link'
import MotionCard from '../../motion-card'
import { Lesson } from '@/payload-types'
import { getStatusLessonColor } from './lessons-color'
import BadgeModule from './lesson-badge-module'
import { LessonStatusBadge } from './lesson-status-badge'
import { Book, BookOpen } from 'lucide-react'

interface LessonsCardProps {
  lesson: Lesson
}

const LessonsCard = ({ lesson }: LessonsCardProps) => {
  const module = typeof lesson?.module === 'object' ? lesson.module : null
  return (
    <MotionCard key={lesson?.id}>
      <div className="group relative w-full transform shadow-sm rounded-xl bg-sidebar h-full transition-all duration-500">
        <div
          className={`absolute w-full -inset-1 ${getStatusLessonColor(String(lesson?.status))} rounded-2xl blur opacity-20 transition duration-1000`}
        />
        <div className="relative  rounded-lg overflow-hidden">
          <div
            className={`relative p-6  bg-linear-to-r ${getStatusLessonColor(String(lesson?.status))} overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            <div className="flex flex-row justify-between">
              <div className="relative z-10">
                <div className="flex gap-1 mt-2">
                  <BadgeModule module={module} />
                  <LessonStatusBadge status={String(lesson?.status)}></LessonStatusBadge>
                </div>
                <h3 className="text-xl font-bold">{lesson?.name}</h3>
                <p className="text-sm min-h-8 leading-relaxed">{lesson?.description}</p>
              </div>
              <div className="flex items-start justify-between">
                <DetailLink route="lessons" id={lesson?.id} />
              </div>
            </div>
          </div>
        </div>
        <BookOpen size={128} className="absolute bottom-0 right-0 opacity-2 hidden sm:block" />
      </div>
    </MotionCard>
  )
}

export default LessonsCard
