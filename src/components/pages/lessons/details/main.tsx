'use server'
import { getAllLessons } from '@/actions/lessons'
import Fallback from '@/components/fallback'
import { Lesson, LessonRequest, Media, Module } from '@/payload-types'
import LessonsDropdownList from '../lessons-dropdown-list'
import Details from './details'
import { LessonsModulesDetails } from './lesson-modules-details'
import LessonCompletedUser from '../lesson-completed-users'
import LessonRequestCardList from '../lesson-request/lesson-reques-card-list'
import { FileList } from './lesson-files'

export const MainDetails = async ({ lesson }: { lesson: Lesson }) => {
  const lessons = await getAllLessons(0)
  return (
    <div className="mx-auto w-full max-w-6xl ">
      <div className="sticky top-0 z-50 pt-2  backdrop-blur-md bg-background/80">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Fallback />
          </div>
          <div className="col-span-6 flex justify-end">
            <LessonsDropdownList lessons={lessons} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-stretch ">
        <div className="col-span-8">
          <Details lesson={lesson} />
        </div>
        <div className="col-span-4">
          <LessonsModulesDetails modules={lesson?.module as Module} />
        </div>
        <div className="col-span-4">
          {lesson?.users?.docs && (
            <div className="bg-sidebar rounded-2xl border border-white/20 overflow-hidden h-full">
              <LessonCompletedUser users={lesson.users.docs} />
            </div>
          )}
        </div>
        <div className="col-span-4">
          <FileList files={lesson?.docs as Media[]} />
        </div>
        <div className="col-span-12">
          <LessonRequestCardList
            lesson_requests={lesson?.lesson_requests?.docs as LessonRequest[]}
          />
        </div>

        {/* 
        <div className="col-span-4 flex flex-col gap-4">
          <div className="shrink-0">
            <UserModuleChart isTitle={false} user={user} />
          </div>

          <div className="flex-1">
            <UserCompletersLessons user={user} />
          </div>
        </div>
        <div className="col-span-8 flex flex-col gap-4">
          <UserModulesDetails user={user} />
        </div> */}
      </div>
    </div>
  )
}

export default MainDetails
