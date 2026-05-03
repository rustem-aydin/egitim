'use client'
import React, { useMemo } from 'react'
import { Expert, Lesson } from '@/payload-types'
import { Badge } from '@/components/ui/badge'

function isModule(value: unknown): value is { id: number } {
  return typeof value === 'object' && value !== null && 'id' in value
}

function isExpertWithModules(
  value: unknown,
): value is Expert & { modules: (number | { id: number })[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'modules' in value &&
    Array.isArray((value as Record<string, unknown>).modules)
  )
}

interface UserModuleProgressProps {
  experts: Expert[]
  completedLessons: Lesson[]
}

const UserModuleProgress: React.FC<UserModuleProgressProps> = ({
  experts = [],
  completedLessons = [],
}) => {
  const expertBadges = useMemo(() => {
    const completedModuleIds = completedLessons
      .filter((lesson) => lesson.status === 'Tamamlandı')
      .map((lesson) => (isModule(lesson.module) ? lesson.module.id : lesson.module))
      .filter((id): id is number => typeof id === 'number')

    const uniqueCompleted = [...new Set(completedModuleIds)]

    return experts.filter(isExpertWithModules).map((expert) => {
      const expertModuleIds = expert.modules
        .map((m) => (isModule(m) ? m.id : m))
        .filter((id): id is number => typeof id === 'number')

      const total = expertModuleIds.length
      const completed = expertModuleIds.filter((id) => uniqueCompleted.includes(id)).length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        expertId: expert.id,
        expertName: expert.name || 'İsimsiz',
        percentage,
      }
    })
  }, [experts, completedLessons])

  return (
    <div className="flex flex-wrap gap-2">
      {expertBadges.map((expert) => (
        <Badge key={expert.expertId} variant="secondary" className="text-xs font-medium">
          %{expert.percentage} {expert.expertName}
        </Badge>
      ))}
    </div>
  )
}

export default UserModuleProgress
