import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Star } from 'lucide-react'
import config from '@payload-config'

import { getFeedbacksByLessonId, getFeedbackStatsAction } from '@/actions/feedbacks'
import { FeedbackCard } from './feedback-card'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { LessonReviewSummary } from './feedback-details'
import { User } from '@/payload-types'

const Feedbacks = async ({ id }: { id: number }) => {
  const feedbacks = await getFeedbacksByLessonId(id)
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: await headers() })
  const data = await getFeedbackStatsAction(String(id))
  const { overallSatisfactionRating } = data

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="gap-1">
          <span className="text-lg">{overallSatisfactionRating}</span>
          <Star className="fill-yellow-500 text-yellow-500" />
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent className=" min-w-[450px]">
        <ScrollArea className="h-full w-full p-4 ">
          <LessonReviewSummary user_id={Number((user?.user as User).id)} id={Number(id)} />
          <div className="space-y-4 mt-4">
            {feedbacks?.map((feedback) => (
              <FeedbackCard user={user} key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default Feedbacks
