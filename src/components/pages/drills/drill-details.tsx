'use client'

import Section from '@/components/section'
import 'moment/locale/tr'
import moment from 'moment'
import Link from 'next/link'
import Fallback from '@/components/fallback'
import { Drill } from '@/payload-types'
import { getGroupColors } from './drill-colors'
import { Calendar } from 'lucide-react'
import DrillCompletedUser from './drill-completed-users'

const shimmerKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
`

interface DrillDetailsProps {
  drill: Drill
}

function DrillDetails({ drill }: DrillDetailsProps) {
  const categoryName: string = (drill?.group as any)?.category?.name ?? ''
  const categoryColor: string = (drill?.group as any)?.category?.color ?? '#f59e0b'
  const theme = getGroupColors(categoryColor)

  return (
    <div className="max-w-6xl w-full justify-center items-center mx-auto p-4">
      <Fallback />
      <style>{shimmerKeyframes}</style>
      <div className="flex gap-4">
        <div
          className="relative w-full overflow-hidden rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
          style={theme.bgGradient}
        >
          {/* Dekoratif arka plan daireleri */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute -top-8 -left-8 h-32 w-32 animate-pulse rounded-full"
              style={theme.pulseStyle}
            />
            <div
              className="absolute right-0 bottom-0 h-40 w-40 rounded-full blur-md"
              style={theme.blurLgStyle}
            />
            <div
              className="absolute bottom-12 left-1/3 h-24 w-24 rounded-full blur-sm"
              style={theme.blurSmStyle}
            />
            <div
              className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full"
              style={theme.pulseStyle}
            />
          </div>

          {/* Shimmer efekti */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] skew-x-12" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-4">
                {/* Kategori Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="relative inline-block rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
                    style={theme.badgeStyle}
                  >
                    {categoryName || 'Kategorisiz'}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                        style={theme.pingStyle}
                      />
                      <span
                        className="relative inline-flex h-3 w-3 rounded-full"
                        style={theme.pulseStyle}
                      />
                    </span>
                  </span>
                </div>

                {/* Başlık */}
                <h2
                  className="text-3xl font-bold md:text-4xl lg:text-5xl leading-tight"
                  style={theme.textStyle}
                >
                  <span className="relative">
                    {drill?.name}
                    <span
                      className="absolute bottom-0 left-0 h-1 w-full rounded-full"
                      style={theme.badgeStyle}
                    />
                  </span>
                </h2>

                {/* Açıklama */}
                <p className="text-lg leading-relaxed font-medium" style={theme.textStyle}>
                  {drill?.description}
                </p>

                {/* Tarih Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Başlangıç Tarihi */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                    <p className="text-sm text-black font-bold mb-2 flex items-center gap-2">
                      <Calendar size={16} color="red"></Calendar>
                      Başlangıç Tarihi
                    </p>
                    <div className="text-lg font-semibold mb-1" style={theme.textStyle}>
                      {drill?.date_from
                        ? moment(drill.date_from).locale('tr').format('DD MMMM YYYY')
                        : '-'}
                    </div>
                    <div className="flex text-black  items-center gap-2 text-sm">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor:
                            drill?.date_from && new Date(drill.date_from) > new Date()
                              ? '#eab308' // Gelecekte
                              : '#22c55e', // Başlamış/Geçmiş
                        }}
                      />
                      {drill?.date_from ? moment(drill.date_from).locale('tr').fromNow() : ''}
                    </div>
                  </div>

                  {/* Bitiş Tarihi */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                    <p className="text-sm text-black font-bold mb-2 flex items-center gap-2">
                      <Calendar size={16} color="green"></Calendar>
                      Bitiş Tarihi
                    </p>
                    <div className="text-lg text-black font-semibold mb-1" style={theme.textStyle}>
                      {drill?.date_to
                        ? moment(drill.date_to).locale('tr').format('DD MMMM YYYY')
                        : '-'}
                    </div>
                    <div className="flex text-black  items-center gap-2 text-sm ">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor:
                            drill?.date_to && new Date(drill.date_to) > new Date()
                              ? '#eab308' // Devam ediyor
                              : '#ef4444', // Bitmiş
                        }}
                      />
                      {drill?.date_to ? moment(drill.date_to).locale('tr').fromNow() : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Konum & Buton */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex-1 hover:bg-white/30 transition-colors">
                  <div className="p-2 rounded-lg text-white shadow-md" style={theme.badgeStyle}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-black font-medium">Konum</p>
                    <p className="font-semibold" style={theme.textStyle}>
                      {drill?.location || 'Belirtilmedi'}
                    </p>
                  </div>
                </div>

                {drill?.info_url && (
                  <Link
                    href={drill.info_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white rounded-xl px-4 py-3 flex-1 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group"
                    style={theme.badgeStyle}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <svg
                        className="w-5 h-5 group-hover:rotate-12 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/90 font-medium">Bağlantı</p>
                      <p className="font-semibold">Detayları Görüntüle</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {drill?.participants && <DrillCompletedUser users={drill.participants} />}
      </div>
    </div>
  )
}

export default DrillDetails
