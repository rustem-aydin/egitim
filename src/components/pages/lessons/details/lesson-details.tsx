import { Calendar, GraduationCap, MapPin, Presentation, Users, Zap } from 'lucide-react'
import Fallback from '@/components/fallback'
import { Category, Lesson, Location, Module, User } from '@/payload-types'
import BadgeModule from '../lesson-badge-module'
import { formatDate, formatTimeWithDateObject, getStatusLessonColor } from '../lessons-color'
import Feedbacks from '../feedbacks/feedbacks'
import { LessonStatusBadge } from '../lesson-status-badge'
import { LessonCompletedUser } from '../lesson-completed-users'
import LessonRequestCardList from '../lesson-request/lesson-reques-card-list'
import { LessonsModulesDetails } from '../lesson-modules-details'
import LessonRequest from '../lesson-request/lessons-request'
import { FileList } from './lesson-files'

const sampleFiles: any[] = [
  {
    id: '1',
    name: 'proje-raporu.pdf',
    size: '2.4 MB',
    type: 'application/pdf',
    url: 'https://example.com/files/proje-raporu.pdf',
    date: '29 Nis 2026',
  },
  {
    id: '2',
    name: 'finansal-veriler.xlsx',
    size: '156 KB',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: 'https://example.com/files/finansal-veriler.xlsx',
    date: '28 Nis 2026',
  },
  {
    id: '3',
    name: 'logo-tasarimi.png',
    size: '3.1 MB',
    type: 'image/png',
    url: 'https://example.com/files/logo-tasarimi.png',
    date: '27 Nis 2026',
  },
  {
    id: '4',
    name: 'api-dokumantasyonu.ts',
    size: '12 KB',
    type: 'text/typescript',
    url: 'https://example.com/files/api-dokumantasyonu.ts',
    date: '26 Nis 2026',
  },
  {
    id: '5',
    name: 'sunum-videosu.mp4',
    size: '45.8 MB',
    type: 'video/mp4',
    url: 'https://example.com/files/sunum-videosu.mp4',
    date: '25 Nis 2026',
  },
  {
    id: '6',
    name: 'yedek-arsivi.zip',
    size: '128 MB',
    type: 'application/zip',
    url: 'https://example.com/files/yedek-arsivi.zip',
    date: '24 Nis 2026',
  },
]

const LessonDetails = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div className=" w-full text-sidebar-foreground mx-auto p-4">
      <Fallback />

      <div className="grid grid-cols-3 w-full gap-4">
        {/* ═══════ SATIR 1 SOL: Ana Ders Kartı (2/3) ═══════ */}
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
                          {formatDate(lesson.date_from)} -{' '}
                          {formatTimeWithDateObject(lesson.date_from)}
                        </div>
                      </div>
                    </div>
                  )}

                  {lesson?.location && (
                    <div className="flex items-center">
                      <MapPin className="w-8 h-8 mr-2 text-pink-400" />
                      <div>
                        <div className="text-xs">Konum</div>
                        <div className="text-sm font-medium">
                          {(lesson.location as Location).name}
                        </div>
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

        {/* ═══════ SATIR 1 SAĞ: Tamamlayan Personeller (1/3) ═══════ */}
        <div className=" w-full">
          {lesson?.users?.docs && (
            <div className="bg-sidebar rounded-2xl border border-white/20 overflow-hidden h-full">
              <LessonCompletedUser users={lesson.users.docs} />
            </div>
          )}
        </div>

        {/* ═══════ SATIR 2 SOL: Modüller (2/3) - içerik çok olduğu için geniş alanda ═══════ */}
        <div className="col-span-2 w-full">
          <LessonsModulesDetails modules={lesson?.module as Module} />
        </div>

        {/* ═══════ SATIR 2 SAĞ: Dosya Listesi (1/3) - dikey liste dar alanda daha iyi ═══════ */}
        <div className="col-span-1 min-w-0">
          <FileList files={sampleFiles} title="Proje Dosyaları" />
        </div>

        {/* ═══════ SATIR 3: Talepler (3/3 tam genişlik) ═══════ */}
        <div className="col-span-3 min-w-0">
          <LessonRequestCardList id={String(lesson.id)} />
        </div>
      </div>
    </div>
  )
}

export default LessonDetails
