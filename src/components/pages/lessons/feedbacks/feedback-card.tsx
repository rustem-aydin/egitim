'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import StarRating from '@/components/ui/rating'
import { Feedback, User } from '@/payload-types'
import { Trash2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
interface FeedbackCardProps {
  feedback: Feedback
  user: User | any
}
export function FeedbackCard({ feedback, user }: FeedbackCardProps) {
  const processedData = React.useMemo(() => {
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
    let totalScore = 0
    let validColumnCount = 0
    const detailedScores: { name: string; value: number }[] = []

    for (const criterion of ratingCriteria) {
      const score = feedback[criterion.key]
      if (typeof score === 'number') {
        totalScore += score
        validColumnCount++
        detailedScores.push({ name: criterion.label, value: score })
      }
    }

    const averageRating =
      validColumnCount > 0 ? parseFloat((totalScore / validColumnCount).toFixed(1)) : 0

    const reviewerName = (feedback.user_id as User)?.name ?? 'Bilinmeyen Kullanıcı'
    const reviewDate = new Date(feedback.createdAt).toLocaleDateString('tr-TR')

    return {
      rating: averageRating,
      reviewDate,
      reviewerName,
      detailedScores,
    }
  }, [feedback])
  const { rating, reviewDate, reviewerName, detailedScores } = processedData
  const handleDelete = () => {
    // mutate()
  }
  return (
    <Card className="flex max-w-[415px] flex-col gap-4 rounded-lg border px-6 py-4">
      <div className="flex flex-col flex-wrap justify-between gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <StarRating value={rating} maxStars={10} iconSize={18} readOnly />
          <p className="text-sm font-semibold">({rating}/10 Ortalama)</p>
        </div>
        <div className="flex gap-2">
          <p className="text-muted-foreground text-sm">{reviewDate}</p>
          <p className="text-muted-foreground text-sm">
            - {moment(feedback?.createdAt).locale('tr-TR').fromNow()}
          </p>
        </div>
      </div>

      {/* --- DOĞRUDAN ENTEGRE EDİLMİŞ CHART --- */}
      <div>
        <h4 className="text-sm font-medium mb-2">Değerlendirme Kriterleri</h4>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <BarChart
            data={detailedScores} // 'processedData'dan gelen veriyi kullanıyoruz
            margin={{ top: 20, right: 10, left: -20, bottom: 55 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              type="number"
              dataKey="value"
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Bar dataKey="value" radius={4} fill="var(--primary)">
              <LabelList
                dataKey="value"
                position="top"
                offset={4}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        <span className="text-muted-foreground">{feedback?.comment_text}</span>
      </div>

      <div className="flex flex-row items-end justify-between gap-4 border-t pt-4">
        <div>
          <p className="text-sm font-semibold">{reviewerName}</p>
          <p className="font-base text-muted-foreground text-sm">
            {(feedback?.user_id as User)?.rank}
          </p>
        </div>
        {(feedback?.user_id as User)?.email === user?.user?.email && (
          <Button onClick={handleDelete} variant={'destructive'} className="gap-2">
            <Trash2 className="w-4" />
            Sil
          </Button>
        )}
      </div>
    </Card>
  )
}

export default FeedbackCard
