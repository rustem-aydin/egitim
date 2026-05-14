import { Category, Lesson, Location, Module, User } from '@/payload-types'
import BadgeModule from '../lesson-badge-module'
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  MapPin,
  Presentation,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { formatDate, formatTimeWithDateObject, getStatusLessonColor } from '../lessons-color'
import { LessonStatusBadge } from '../lesson-status-badge'
import Feedbacks from '../feedbacks/feedbacks'
import LessonRequest from '../lesson-request/lessons-request'

const Details = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className="col-span-3 w-full min-w-0">
      <div className="group relative w-full transform shadow-2xl rounded-2xl transition-all duration-500">
        <div
          className={`absolute -inset-1 bg-linear-to-r ${getStatusLessonColor(String(lesson?.status))} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000`}
        ></div>

        <div className="relative rounded-2xl border border-white/20 overflow-hidden bg-sidebar">
          {/* Header */}
          <div
            className={`relative p-6 flex justify-between bg-linear-to-r ${getStatusLessonColor(String(lesson?.status))} overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="flex gap-2">
                <div className="flex flex-row gap-2">
                  <BadgeModule module={lesson?.module as Module} />
                </div>
                {lesson?.status && <LessonStatusBadge status={String(lesson.status)} />}
              </div>

              <h3 className="text-xl font-bold">{lesson?.name}</h3>
              <p className="text-sm min-h-8 leading-relaxed">{lesson?.description}</p>
            </div>

            <div className="flex flex-row gap-1">
              {lesson?.status &&
                (lesson.status === 'Tamamlandı' || lesson.status === 'İşleme Alındı') &&
                lesson?.id && <Feedbacks id={lesson.id} />}
              <LessonRequest id={lesson.id} />
            </div>
          </div>

          {/* İçerik */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {lesson?.date_from && (
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 mr-2 text-green-400" />
                  <div>
                    <div className="text-xs">Başlangıç Tarihi</div>
                    <div className="text-sm font-medium">
                      {formatDate(lesson.date_from)} - {formatTimeWithDateObject(lesson.date_from)}
                    </div>
                  </div>
                </div>
              )}

              {lesson?.location && (
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 mr-2 text-pink-400" />
                  <div>
                    <div className="text-xs">Konum</div>
                    <div className="text-sm font-medium">{(lesson.location as Location).name}</div>
                  </div>
                </div>
              )}

              {lesson?.students !== undefined && lesson?.students !== null && (
                <div className="flex items-center">
                  <Users className="w-8 h-8 mr-2 text-orange-400" />
                  <div>
                    <div className="text-xs">Katılımcı</div>
                    <div className="text-sm font-medium">{lesson.students} kişi</div>
                  </div>
                </div>
              )}

              {lesson?.date_to && (
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 mr-2 text-red-400" />
                  <div>
                    <div className="text-xs">Bitiş Tarihi</div>
                    <div className="text-sm font-medium">
                      {formatDate(lesson.date_to)} - {formatTimeWithDateObject(lesson.date_to)}
                    </div>
                  </div>
                </div>
              )}

              {lesson?.instructor && (
                <div className="flex items-center">
                  <GraduationCap className="w-8 h-8 mr-2 text-yellow-400" />
                  <div>
                    <div className="text-xs">Eğitmen</div>
                    <div className="text-sm font-medium">{lesson?.instructor}</div>
                  </div>
                </div>
              )}

              {lesson?.category && (
                <div className="flex items-center">
                  <Presentation className="w-8 h-8 mr-2 text-cyan-400" />
                  <div>
                    <div className="text-xs">Eğitim Türü</div>
                    <div className="text-sm font-medium">
                      {(lesson?.category as Category)?.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center shadow-xl justify-between mb-6 p-4 rounded-xl border border-white/10">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 bg-linear-to-r ${getStatusLessonColor(String(lesson?.status))} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-xs">Dersi Oluşturan</p>
                  <p className="text-sm font-bold">
                    {(lesson?.by_generate as User)?.rank +
                      ' ' +
                      (lesson?.by_generate as User)?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
