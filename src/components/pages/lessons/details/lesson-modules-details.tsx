import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Module } from '@/payload-types'
import BadgeModule from '../lesson-badge-module'
import MiniLessonCard from '../mini-lesson-card'

export const LessonsModulesDetails = ({ modules }: { modules: Module }) => {
  return (
    <>
      {modules && (
        <div className="group relative w-full h-full transform shadow-2xl rounded-2xl transition-all duration-500">
          <Card className="h-full border max-h-[400px] flex flex-col">
            <CardHeader className="relative flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-linear-to-b from-primary to-primary/40" />
                <CardTitle className="text-lg font-semibold tracking-tight">
                  <BadgeModule module={modules} /> ait tüm dersler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
              <div className="grid gap-3">
                {modules.lessons?.docs?.map((lesson: any) => (
                  <MiniLessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
