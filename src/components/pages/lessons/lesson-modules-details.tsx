import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Module } from '@/payload-types'
import BadgeModule from './lesson-badge-module'
import LessonsCard from './lesson-card'

export const LessonsModulesDetails = ({ modules }: { modules: Module }) => {
  return (
    <>
      {modules && (
        <div className="group relative w-2/6 mt-4 min-h-full transform shadow-2xl rounded-2xl transition-all duration-500">
          <Card className="h-full border">
            <CardHeader className=" relative">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-linear-to-b from-primary to-primary/40" />
                <CardTitle className="text-lg font-semibold tracking-tight">
                  <BadgeModule module={modules} /> ait tüm dersler
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {modules.lessons?.docs?.map((lesson: any) => (
                <LessonsCard key={lesson.id} lesson={lesson} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
