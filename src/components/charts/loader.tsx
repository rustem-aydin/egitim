import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const ChartLoader = () => {
  return (
    <Card className="flex flex-col items-center justify-center h-[466px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-2 text-muted-foreground">Veriler yükleniyor...</p>
    </Card>
  )
}

export default ChartLoader
