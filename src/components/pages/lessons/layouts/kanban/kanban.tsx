import { CardContent, CardTitle } from '@/components/ui/card'
import { Lesson } from '@/payload-types'
import LessonsCard from '../../lesson-card'

interface GroupedLessons {
  [key: string]: Lesson[]
}

const STATUS_COLUMNS = [
  {
    key: 'Taslak',
    label: 'Taslak',
    color: 'from-slate-400 to-slate-600',
    dotColor: 'bg-slate-400',
    ringColor: 'ring-slate-400/20',
    emptyIcon: '○',
    bgAccent: 'bg-slate-500/[0.03]',
    borderColor: 'border-slate-500/10',
    headerBg: 'bg-gradient-to-r from-slate-500/5 to-transparent',
  },
  {
    key: 'Planlanıyor',
    label: 'Planlanıyor',
    color: 'from-blue-400 to-blue-600',
    dotColor: 'bg-blue-400',
    ringColor: 'ring-blue-400/20',
    emptyIcon: '◎',
    bgAccent: 'bg-blue-500/[0.03]',
    borderColor: 'border-blue-500/10',
    headerBg: 'bg-gradient-to-r from-blue-500/5 to-transparent',
  },
  {
    key: 'İşleme Alındı',
    label: 'İşleme Alındı',
    color: 'from-amber-400 to-amber-600',
    dotColor: 'bg-amber-400',
    ringColor: 'ring-amber-400/20',
    emptyIcon: '◑',
    bgAccent: 'bg-amber-500/[0.03]',
    borderColor: 'border-amber-500/10',
    headerBg: 'bg-gradient-to-r from-amber-500/5 to-transparent',
  },
  {
    key: 'Tamamlandı',
    label: 'Tamamlandı',
    color: 'from-emerald-400 to-emerald-600',
    dotColor: 'bg-emerald-400',
    ringColor: 'ring-emerald-400/20',
    emptyIcon: '●',
    bgAccent: 'bg-emerald-500/[0.03]',
    borderColor: 'border-emerald-500/10',
    headerBg: 'bg-gradient-to-r from-emerald-500/5 to-transparent',
  },
]

const LessonKanban = ({ lessons }: { lessons: Lesson[] }) => {
  const groupedByStatus = lessons.reduce((acc: GroupedLessons, lesson) => {
    const status = lesson.status || 'Taslak'
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(lesson)
    return acc
  }, {})

  const totalLessons = lessons.length

  return (
    <>
      {/* Global keyframes — styled-jsx yerine güvenli yaklaşım */}
      <style>{`
        @keyframes kanban-fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kanban-card-anim {
          animation: kanban-fade-in-up 0.35s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="grid grid-cols-4 mt-4 gap-5 mb-4">
        {STATUS_COLUMNS.map((column) => {
          const columnLessons = groupedByStatus[column.key] || []
          const isEmpty = columnLessons.length === 0
          const count = columnLessons.length
          const percentage = totalLessons > 0 ? Math.round((count / totalLessons) * 100) : 0

          return (
            <div key={column.key} className="group relative flex flex-col">
              {/* Üst gradient çizgi */}
              <div
                className={`absolute -top-px left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${column.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div
                className={`flex flex-col h-full rounded-2xl border ${column.borderColor} bg-background/50 backdrop-blur-sm overflow-hidden transition-all duration-500 group-hover:shadow-lg group-hover:shadow-black/[0.03] group-hover:border-opacity-20`}
              >
                {/* Header */}
                <div className={`px-5 pt-5 pb-3 ${column.headerBg} transition-colors duration-500`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${column.dotColor} opacity-40`}
                        />
                        <span
                          className={`relative inline-flex h-3 w-3 rounded-full ${column.dotColor}`}
                        />
                      </span>
                      <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                        {column.label}
                      </CardTitle>
                    </div>

                    {/* Sayı badge */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${column.bgAccent} ring-1 ${column.ringColor}`}
                    >
                      <span>{count}</span>
                      {percentage > 0 && (
                        <span className="text-muted-foreground/50 font-normal text-[10px]">
                          %{percentage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="mt-3 h-[2px] rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${column.color} transition-all duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* İçerik */}
                <CardContent className="flex-1 px-3 pb-3 pt-1">
                  {isEmpty ? (
                    <div
                      className={`flex flex-col items-center justify-center h-full py-16 text-center rounded-xl border border-dashed ${column.borderColor} mt-1 transition-colors duration-300 group-hover:border-opacity-30`}
                    >
                      <span className="text-3xl mb-3 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        {column.emptyIcon}
                      </span>
                      <p className="text-xs font-medium text-muted-foreground/40">
                        Henüz ders eklenmedi
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 mt-1">
                      {columnLessons.map((lesson, i) => (
                        <div
                          key={lesson.id}
                          className="kanban-card-anim"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <LessonsCard lesson={lesson} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default LessonKanban
