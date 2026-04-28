// components/lessons/load-more-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface LoadMoreButtonProps {
  nextPage: number
}

const LoadMoreButton = ({ nextPage }: LoadMoreButtonProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" onClick={handleLoadMore}>
        Daha Fazla Yükle
      </Button>
    </div>
  )
}

export default LoadMoreButton
