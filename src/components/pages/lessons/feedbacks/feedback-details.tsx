import { Card } from '@/components/ui/card'

import StarRating from '@/components/ui/rating'
import AddComment from './add-feedback'
import { getFeedbacksByLessonId, getFeedbackStatsAction } from '@/actions/server/feedbacks'
import { MiniBarChart } from './mini-chart'

export async function LessonReviewSummary({ user_id, id }: { user_id: number; id: number }) {
  const feedback = await getFeedbacksByLessonId(id)
  const data = await getFeedbackStatsAction(String(id))
  if (!feedback) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 min-h-[420px]">
        <h3 className="text-lg font-semibold">Ders Değerlendirmeleri</h3>
        <p className="text-muted-foreground mt-2">Bu ders için henüz hiç yorum yapılmamış.</p>
        <div className="mt-4">
          <AddComment user_id={user_id} id={id} />
        </div>
      </Card>
    )
  }

  const { overallSatisfactionRating, totalReviewCount, detailedAverages } = data

  return (
    <Card className="flex flex-col max-w-[415px] rounded-lg gap-8 px-6 py-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="mb-1 text-2xl font-bold">Genel Değerlendirme Özeti</h2>
        <p className="text-muted-foreground mb-6 text-sm">Bu ders için ortalama puanlar</p>

        <div className="mb-4 flex flex-col items-center">
          <span className="mb-2 text-5xl font-bold">{overallSatisfactionRating}</span>
          <StarRating
            value={overallSatisfactionRating}
            maxStars={10}
            readOnly
            iconSize={24}
            className="mb-2"
          />
          <p className="text-muted-foreground text-sm">
            Toplam {totalReviewCount} değerlendirmeye göre
          </p>
        </div>
        <AddComment user_id={user_id} id={id} />
      </div>

      <div className="mx-auto w-full max-w-md space-y-2">
        <h4 className="text-sm font-medium text-center mb-2">Kriter Bazında Ortalama Puanlar</h4>
        <MiniBarChart data={detailedAverages} />
      </div>
    </Card>
  )
}
