import { Card } from '@/components/ui/card'

const ChartError = ({ error }: any) => {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[420px] bg-destructive/10">
      <p className="text-destructive">Veri yüklenirken bir hata oluştu.</p>
      <p className="text-xs text-destructive/80 mt-1">{error.message}</p>
    </Card>
  )
}

export default ChartError
