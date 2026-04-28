'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import BadgeModule from '../modules/modules-badge-code'
import { Lesson } from '@/payload-types'

interface Props {
  lessons: Lesson[]
  modules: any[]
}
const UserModules = ({ lessons, modules }: Props) => {
  const completedModuleIds = React.useMemo(() => {
    if (!lessons) return new Set()
    return new Set(lessons.map((l: any) => l.module?.id))
  }, [lessons])
  return (
    <div className="flex gap-2 flex-wrap">
      {modules?.map((module, index) => {
        // Use the ID if it exists, otherwise fall back to the index
        const uniqueKey = module?.id || index
        const isCompleted = completedModuleIds.has(module?.id)

        if (!isCompleted) {
          return (
            <Link
              key={uniqueKey} // Use the guaranteed key
              href={`/modules/${module?.id}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Badge
                key={uniqueKey} // Use the guaranteed key
                variant="secondary"
                className="bg-gray-500/30  border-gray-500/20 text-gray-600  rounded-md "
                // ... rest of props
              >
                <span className="text-gray-600  text-sm font-semibold ">
                  {module?.code ?? 'Modül'}
                </span>
              </Badge>
            </Link>
          )
        }

        return (
          <Link
            key={uniqueKey} // Use the guaranteed key
            href={`/modules/${module?.id}`}
            className="hover:opacity-80 transition-opacity"
          >
            <BadgeModule code={module?.code} />
          </Link>
        )
      })}
    </div>
  )
}

export default UserModules
