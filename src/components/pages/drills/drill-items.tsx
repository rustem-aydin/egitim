// components/pages/_drills/drill-items.tsx
'use client'

import DetailLink from '@/components/detail-link'
import moment from 'moment'
import 'moment/locale/tr'
import type { Drill } from '@/payload-types'

interface DrillItemsProps {
  drill: Drill
  colors: any
}

export default function DrillItems({ drill, colors }: DrillItemsProps) {
  const group = drill.group as any
  const category = group?.category as any
  return (
    <div className=" backdrop-blur-sm rounded-lg p-4 border border-black/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h3
              className={`text-xl font-bold `}
              style={colors?.textStyle} // Direkt hex rengi de uygulanabilir
            >
              {drill.name}
            </h3>
            {category?.name && (
              <span
                className={`inline-block rounded-full bg-linear-to-r  px-3 py-1 text-sm font-semibold text-white`}
                style={colors?.badgeStyle} // Direkt hex rengi de uygulanabilir
              >
                {category.name}
              </span>
            )}
          </div>

          <p
            className={`text-sm  opacity-80`}
            style={colors?.textStyle} // Direkt hex rengi de uygulanabilir
          >
            {drill.description}
          </p>

          <div className="flex flex-wrap items-center text-black gap-4 text-sm category">
            {drill.date_from && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                {formatDate(drill.date_from)}
                {drill.date_to && ` — ${formatDate(drill.date_to)}`}
              </div>
            )}

            {drill.location && (
              <div className="flex items-center gap-2">
                <LocationIcon />
                {drill.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {drill.info_url && (
            <a
              href={drill.info_url}
              target="_blank"
              rel="noopener noreferrer"
              style={colors?.badgeStyle} // Direkt hex rengi de uygulanabilir
              className={`flex items-center gap-2 bg-gradient-to-r rounded-lg px-4 py-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm`}
            >
              <LinkIcon />
              Bağlantı
            </a>
          )}
          <DetailLink color="text-black" route="drills" id={drill.id} />
        </div>
      </div>
    </div>
  )
}

function formatDate(date: string | Date): string {
  return moment(date).locale('tr').format('DD MMMM YYYY')
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  )
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}
