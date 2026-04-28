'use client'
import React, { useMemo } from 'react'
import { Progress } from '../ui/progress'

interface UserModuleProgressProps {
  requiredModules: any[]
  completedLessons: any[]
}

const UserModuleProgress: React.FC<UserModuleProgressProps> = ({
  requiredModules = [],
  completedLessons = [],
}) => {
  const { completed, total, percentage } = useMemo(() => {
    // 1. Zorunlu modül ID'lerini güvenli şekilde çıkar
    const requiredModuleIds = requiredModules.map((m) =>
      typeof m === 'object' && m !== null ? m.id : m,
    )

    // 2. Kullanıcının tamamladığı derslerden modül ID'lerini bul
    const completedModuleIds = completedLessons
      .map((lesson) =>
        typeof lesson.module === 'object' && lesson.module !== null
          ? lesson.module.id
          : lesson.module,
      )
      .filter(Boolean)

    // 3. Benzersizleştir (Aynı modülden birden fazla ders almış olabilir)
    const uniqueCompleted = [...new Set(completedModuleIds)]

    // 4. Aldığı derslerin modüllerinden kaçı zorunlu grupta var?
    const completedRequired = uniqueCompleted.filter((id) => requiredModuleIds.includes(id))

    const totalCount = requiredModuleIds.length
    const completedCount = completedRequired.length
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return {
      completed: completedCount,
      total: totalCount,
      percentage: percent,
    }
  }, [requiredModules, completedLessons])

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>İlerleme</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2 transition-all border duration-300 ease-in-out" />
      <div className="text-xs text-gray-500">
        {completed} / {total} modül tamamlandı
      </div>
    </div>
  )
}

export default UserModuleProgress
