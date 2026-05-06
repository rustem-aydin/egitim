'use client'
import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Media } from '@/payload-types'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
// ... mevcut import'ların ...

export default function ImageCarousel({ certificates }: { certificates: Media[] }) {
  const [selectedImage, setSelectedImage] = useState<Media | null>(null)

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0">
      {certificates?.length === 0 ? (
        <span>Veri Bulunamadı</span>
      ) : (
        <div className="flex flex-wrap gap-2 items-center justify-center w-full">
          <Carousel opts={{ align: 'start' }} className="w-full max-w-3xl">
            <CarouselContent>
              {(certificates as Media[])?.map((cert) => (
                <CarouselItem key={cert?.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    {/* Card'a tıklanabilirlik eklendi */}
                    <Card
                      className="relative aspect-3/4 overflow-hidden border-0 p-0 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(cert)}
                    >
                      <Image
                        src={String(cert?.url)}
                        alt={`Sertifika ${cert?.id}`}
                        fill
                        className="object-cover"
                      />
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {/* Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogClose className="text-red-500"></DialogClose>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-transparent shadow-none">
          {selectedImage && (
            <div className="relative w-full aspect-[3/4] max-h-[85vh]">
              <Image
                src={String(selectedImage.url)}
                alt={`Sertifika ${selectedImage.id}`}
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
