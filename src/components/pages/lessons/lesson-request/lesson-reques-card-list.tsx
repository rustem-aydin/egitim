import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { getAllLessonsRequests } from '@/actions/server/lessonRequests'
import { Lesson, User } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

const LessonRequestCardList = async ({ id }: { id: string }) => {
  const requests = await getAllLessonsRequests(id)

  if (!requests || requests.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row  justify-between">
              <span>Talepler</span>
              <Badge>
                <span>{requests.length} Talep</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center max-h-32 justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Henüz talep yok</h3>
            <p className="text-sm text-muted-foreground mt-1">Ders talebi bulunmamaktadır.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row  justify-between">
            <span>Talepler</span>
            <Badge>
              <span>{requests.length} Talep</span>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {requests.map((request) => {
              const userName =
                (request.users as User)?.name || (request.users as User)?.email || '—'
              const initials = userName
                .split(' ')
                .map((n: any) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              return (
                <CarouselItem
                  key={request.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <Card className="h-full flex flex-col bg-background border transition-shadow">
                    <CardContent className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-3 pt-2 ">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{userName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {(request.users as User as User).email || ''}
                          </p>
                        </div>
                      </div>

                      <Separator></Separator>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground line-clamp-2">
                          {request.description || 'Açıklama belirtilmemiş'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  )
}

export default LessonRequestCardList
