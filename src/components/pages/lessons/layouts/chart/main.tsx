import { Lesson } from '@/payload-types'
import { MostCompletedLessonsChart } from './most-completed'
import { HighlightableSection } from '@/components/ui/highlightable-section'

export default function Main({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="grid grid-cols-12 mt-2  w-full gap-4">
      <HighlightableSection
        category={'DErsler'}
        className="col-span-12"
        title={'item.subject'}
        description={'item.description'}
      >
        <MostCompletedLessonsChart lessons={lessons} />
      </HighlightableSection>
    </div>
  )
}
