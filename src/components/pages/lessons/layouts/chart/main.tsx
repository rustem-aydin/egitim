import { Lesson } from '@/payload-types'
import { MostCompletedLessonsChart } from './most-completed'
import { HighlightableSection } from '@/components/ui/highlightable-section'
import { ChartBarLessonRequests } from './lesson-requests'
import { ChartBarRatings } from './ratings'

export default function Main({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="grid grid-cols-12 mt-2  w-full gap-4">
      <HighlightableSection
        className="col-span-12"
        title={'item.subject'}
        description={'item.description'}
      >
        <MostCompletedLessonsChart lessons={lessons} />
      </HighlightableSection>
      <HighlightableSection
        className="col-span-12"
        title={'En Çok İstekte Bulunulan Dersler'}
        description={'Derslere yapılan istek sayıları'}
      >
        <ChartBarLessonRequests lessons={lessons} />
      </HighlightableSection>
      <HighlightableSection
        className="col-span-12"
        title={'En Çok Sevilen Derslerr'}
        description={'Derslere verilen puanlar'}
      >
        <ChartBarRatings lessons={lessons} />
      </HighlightableSection>
    </div>
  )
}
