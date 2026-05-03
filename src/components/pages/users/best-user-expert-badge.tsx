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

const BestExpert: React.FC<UserModuleProgressProps> = ({ experts = [], completedLessons = [] }) => {
  const topExpert = useMemo(() => {
    const completedModuleIds = completedLessons
      .filter((lesson) => lesson.status === 'Tamamlandı')
      .map((lesson) => (isModule(lesson.module) ? lesson.module.id : lesson.module))
      .filter((id): id is number => typeof id === 'number')

    const uniqueCompleted = [...new Set(completedModuleIds)]

    const expertBadges = experts.filter(isExpertWithModules).map((expert) => {
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

    // En yüksek yüzdeye sahip uzmanı bul
    if (expertBadges.length === 0) return null
    return expertBadges.sort((a, b) => b.percentage - a.percentage)[0]
  }, [experts, completedLessons])

  if (!topExpert) return null

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary" className="text-xs font-medium">
        %{topExpert.percentage} {topExpert.expertName}
      </Badge>
    </div>
  )
}

export default BestExpert
