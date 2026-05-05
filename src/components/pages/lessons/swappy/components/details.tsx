import { Category, Lesson, User } from '@/payload-types'
import BadgeModule from '../../lesson-badge-module'
import { BookOpen, Clock, GraduationCap, Presentation, Target, Zap } from 'lucide-react'

const Details = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="group relative w-full transform shadow-2xl rounded-2xl transition-all duration-500">
      <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

      <div className="relative rounded-2xl border border-white/20 overflow-hidden bg-sidebar max-h-[400px] flex flex-col">
        {/* Header */}
        <div className="relative p-6 flex justify-between bg-linear-to-r from-violet-600 to-indigo-600 overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex gap-2 mb-2">
              <BadgeModule module={lesson?.module} />
            </div>
            <h3 className="text-xl font-bold">{lesson?.name}</h3>
            <p className="text-sm min-h-8 leading-relaxed">{lesson?.description}</p>
          </div>
        </div>

        {/* İçerik - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {lesson?.category && (
              <div className="flex items-center">
                <Presentation className="w-8 h-8 mr-2 text-cyan-400" />
                <div>
                  <div className="text-xs">Kategori</div>
                  <div className="text-sm font-medium">{(lesson.category as Category)?.name}</div>
                </div>
              </div>
            )}

            {lesson?.duration && (
              <div className="flex items-center">
                <Clock className="w-8 h-8 mr-2 text-orange-400" />
                <div>
                  <div className="text-xs">Süre</div>
                  <div className="text-sm font-medium">{lesson.duration} saat</div>
                </div>
              </div>
            )}

            {(lesson?.module as any)?.lessons?.docs && (
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 mr-2 text-green-400" />
                <div>
                  <div className="text-xs">Ders Sayısı</div>
                  <div className="text-sm font-medium">
                    {(lesson.module as any).lessons.docs.length} ders
                  </div>
                </div>
              </div>
            )}

            {(lesson?.module as any)?.instructor && (
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 mr-2 text-yellow-400" />
                <div>
                  <div className="text-xs">Eğitmen</div>
                  <div className="text-sm font-medium">{(lesson.module as any).instructor}</div>
                </div>
              </div>
            )}

            {(lesson?.module as any)?.objective && (
              <div className="flex items-center">
                <Target className="w-8 h-8 mr-2 text-red-400" />
                <div>
                  <div className="text-xs">Amaç</div>
                  <div className="text-sm font-medium truncate max-w-[180px]">
                    {(lesson.module as any).objective}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center shadow-xl justify-between p-4 rounded-xl border border-white/10">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-linear-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs">Modülü Oluşturan</p>
                <p className="text-sm font-bold">
                  {(lesson?.by_generate as User)?.rank + ' ' + (lesson?.by_generate as User)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
