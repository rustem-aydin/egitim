'use server'
import { Feedback } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath, revalidateTag } from 'next/cache'

export const getFeedbacksByLessonId = async (id: number): Promise<Feedback[]> => {
  const payload = await getPayload({ config })

  const feedbacks = await payload.find({
    collection: 'feedbacks',
    where: { lesson: { equals: id } },
    depth: 3,
  })

  return feedbacks.docs
}

export interface LessonOverallStatsData {
  overallSatisfactionRating: number
  totalReviewCount: number
  detailedAverages: { name: string; value: number }[]
}

export async function getFeedbackStatsAction(
  lessonId: string | string[] | undefined,
): Promise<LessonOverallStatsData> {
  const emptyState: LessonOverallStatsData = {
    overallSatisfactionRating: 0,
    totalReviewCount: 0,
    detailedAverages: [],
  }

  if (!lessonId) return emptyState
  const id = Array.isArray(lessonId) ? lessonId[0] : lessonId

  try {
    const payload = await getPayload({ config })

    // Payload'dan feedback'leri çek
    const { docs: feedbacks } = await payload.find({
      collection: 'feedbacks',
      where: {
        lesson: {
          equals: id,
        },
      },
      limit: 1000, // Gerekirse pagination eklenebilir
    })

    if (!feedbacks || feedbacks.length === 0) return emptyState

    const totalReviewCount = feedbacks.length

    // Tip güvenliği için keyof Feedback kullan
    const ratingCriteria: { key: keyof Feedback; label: string }[] = [
      { key: 'content_meets_expectations', label: 'İçerik' },
      { key: 'topics_contribution_to_job', label: 'Konu Katkısı' },
      { key: 'training_materials_usefulness', label: 'Materyal' },
      { key: 'trainer_expertise_and_delivery', label: 'Eğitmen' },
      { key: 'duration_and_tempo_suitability', label: 'Süre' },
      { key: 'practical_apps_and_examples', label: 'Uygulama' },
      { key: 'perceived_knowledge_increase', label: 'Kazanım' },
      { key: 'training_environment_suitability', label: 'Ortam' },
      { key: 'overall_satisfaction', label: 'Memnuniyet' },
      { key: 'recommendation_to_colleagues', label: 'Tavsiye' },
    ]

    const statsMap = new Map<string, { total: number; count: number }>()
    const individualAverages: number[] = []

    for (const feedback of feedbacks) {
      let feedbackTotal = 0
      let feedbackCount = 0

      for (const criterion of ratingCriteria) {
        const score = feedback[criterion.key]
        if (typeof score === 'number') {
          // Detaylı istatistikler için
          const currentStat = statsMap.get(criterion.label) || {
            total: 0,
            count: 0,
          }
          statsMap.set(criterion.label, {
            total: currentStat.total + score,
            count: currentStat.count + 1,
          })

          // Bu feedback'in ortalaması için
          feedbackTotal += score
          feedbackCount++
        }
      }

      // Bu feedback'in ortalamasını hesapla ve kaydet
      if (feedbackCount > 0) {
        const feedbackAverage = feedbackTotal / feedbackCount
        individualAverages.push(feedbackAverage)
      }
    }

    // Haritadan detaylı ortalamaları hesapla
    const detailedAverages = ratingCriteria.map((criterion) => {
      const stats = statsMap.get(criterion.label)
      const average =
        stats && stats.count > 0 ? parseFloat((stats.total / stats.count).toFixed(1)) : 0
      return { name: criterion.label, value: average }
    })

    // Overall satisfaction rating'i individual averages'ların ortalaması olarak hesapla
    const overallSatisfactionRating =
      individualAverages.length > 0
        ? parseFloat(
            (
              individualAverages.reduce((sum, avg) => sum + avg, 0) / individualAverages.length
            ).toFixed(1),
          )
        : 0

    return { overallSatisfactionRating, totalReviewCount, detailedAverages }
  } catch (error) {
    throw new Error('Could not fetch detailed lesson stats.')
  }
}

export async function onSubmit(values: Feedback) {
  const payload = await getPayload({ config })

  const feedback = await payload.create({
    collection: 'feedbacks',
    data: values,
  })
  revalidatePath('/feedback')

  return feedback
}
