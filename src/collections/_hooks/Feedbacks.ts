// Tüm sayısal alanların isimleri (overall_satisfaction hariç, ayrı hesaplanabilir)
const RATING_FIELDS = [
  'content_meets_expectations',
  'topics_contribution_to_job',
  'training_materials_usefulness',
  'trainer_expertise_and_delivery',
  'duration_and_tempo_suitability',
  'practical_apps_and_examples',
  'perceived_knowledge_increase',
  'training_environment_suitability',
  'overall_satisfaction',
  'recommendation_to_colleagues',
] as const

/**
 * Belirli bir ders için tüm geri bildirimlerin ortalamasını hesaplar
 * ve lessons collection'daki rating alanını günceller.
 */
export const updateLessonRatingHook = async ({ doc, req, operation }: any) => {
  // Hook sadece lesson ilişkisi varsa çalışsın
  const lessonId = typeof doc.lesson === 'string' ? doc.lesson : doc.lesson?.id
  if (!lessonId) return

  try {
    // 1. Bu derse ait TÜM feedback'leri çek
    const feedbacksResult = await req.payload.find({
      collection: 'feedbacks',
      where: {
        lesson: {
          equals: lessonId,
        },
      },
      limit: 1000, // Gerekirse pagination ekleyin
      depth: 0,
    })

    const feedbacks = feedbacksResult.docs

    if (feedbacks.length === 0) {
      // Hiç feedback yoksa rating'i null yap (veya 0)
      await req.payload.update({
        collection: 'lessons',
        id: lessonId,
        data: {
          rating: null,
        },
      })
      return
    }

    // 2. Her feedback için ortalama puanı hesapla, sonra tüm feedback'lerin ortalamasını al
    let totalSum = 0
    let totalCount = 0

    for (const feedback of feedbacks) {
      let feedbackSum = 0
      let feedbackCount = 0

      for (const field of RATING_FIELDS) {
        const value = feedback[field]
        if (typeof value === 'number' && !isNaN(value)) {
          feedbackSum += value
          feedbackCount++
        }
      }

      if (feedbackCount > 0) {
        totalSum += feedbackSum / feedbackCount
        totalCount++
      }
    }

    const averageRating = totalCount > 0 ? totalSum / totalCount : null

    // 3. Lessons collection'daki rating alanını güncelle
    await req.payload.update({
      collection: 'lessons',
      id: lessonId,
      data: {
        rating: averageRating !== null ? Number(averageRating.toFixed(2)) : null,
      },
    })
  } catch (error) {
    console.error('Rating güncellenirken hata:', error)
    // Hata fırlatmayıp loglayabilirsiniz, kullanıcıya göstermemek için
  }

  return doc
}
