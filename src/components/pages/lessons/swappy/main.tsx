import { SwappyProps } from '@/types/types'
import Fallback from '@/components/fallback'
import { Lesson, Media, Module } from '@/payload-types'
import { LessonsModulesDetails } from './components/lesson-modules-details'
import { FileList } from './components/lesson-files'
import Details from './components/details'
import MainSwappy from '@/components/ui/main-swappy'

export default function LessonSwappy({ lesson }: { lesson: Lesson }) {
  console.log(JSON.stringify(lesson, null, 2))

  const initialItems: SwappyProps[] = [
    {
      id: 'module-main-card',
      title: 'Ana Modül Kartı',
      className: 'lg:col-span-8 h-full sm:col-span-7 col-span-12',
      widgets: <Details lesson={lesson} />,
    },
    {
      id: 'module-details',
      title: 'Modül Detayları',
      className: 'lg:col-span-4 sm:col-span-5 col-span-12',
      widgets: <LessonsModulesDetails modules={lesson?.module as Module} />,
    },
    {
      id: 'module-files',
      title: 'Modül Dosyaları',
      className: 'lg:col-span-4 sm:col-span-5 col-span-12',
      widgets: <FileList files={lesson?.docs as Media[]} title="Modül Dosyaları" />,
    },
  ]

  return (
    <div className="max-w-6xl w-full mx-auto p-4">
      <Fallback />
      <MainSwappy items={initialItems} />
    </div>
  )
}
