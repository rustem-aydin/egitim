'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Badge } from './badge'

interface HighlightableSectionProps {
  title: string
  description?: string
  children: React.ReactNode // İçine grafik gelecek
  className?: string
  category?: string
}

export function HighlightableSection({
  title,
  description,
  children,
  className,
  category,
}: HighlightableSectionProps) {
  return (
    <section className={cn('relative flex items-center justify-center scroll-mt-24', className)}>
      <Card className={cn('w-full transition-all duration-500 shadow-none')}>
        <CardHeader className="items-start border-b pb-2 text-start">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <Badge className="h-7">{category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1  pb-0">{children}</CardContent>
      </Card>
    </section>
  )
}
