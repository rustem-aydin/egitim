import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LessonRequest, User } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

const LessonRequestCardList = async ({ lesson_requests }: { lesson_requests: LessonRequest[] }) => {
  if (!lesson_requests || lesson_requests.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle>
            <div className="flex flex-row justify-between">
              <span>Talepler</span>
              <Badge>
                <span>0 Talep</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
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
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>
          <div className="flex flex-row justify-between">
            <span>Talepler</span>
            <Badge>
              <span>{lesson_requests.length} Talep</span>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {lesson_requests?.map((request) => {
              const userName =
                (request.users as User)?.name || (request.users as User)?.email || '—'
              const initials = userName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <CarouselItem
                  key={request.id}
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-[45%] md:basis-[40%] lg:basis-[32%] xl:basis-[24%]"
                >
                  <Card className="h-full flex flex-col bg-background border transition-shadow hover:shadow-md">
                    <CardContent className="flex-1 flex flex-col gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate leading-tight">{userName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {(request.users as User)?.email || ''}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-1 flex-1">
                        <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                          {request.description || 'Açıklama belirtilmemiş'}
                        </p>
                      </div>

                      <div className="pt-2 mt-auto">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-3" />
          <CarouselNext className="hidden sm:flex -right-3" />
        </Carousel>
      </CardContent>
    </Card>
  )
}

export default LessonRequestCardList
