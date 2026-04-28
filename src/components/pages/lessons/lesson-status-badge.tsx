import { Badge } from '@/components/ui/badge'
import { Check, CheckCheck, Clock, Play, TriangleAlert } from 'lucide-react'

export const LessonStatusBadge = ({ status }: { status: string }) => {
  if (status === 'Taslak')
    return (
      <div className="flex items-center justify-between mb-1">
        <Badge variant="secondary" className={` bg-slate-500/70 text-white rounded-lg gap-1`}>
          <Clock></Clock>
          <span className="text-md">{status}</span>
        </Badge>
      </div>
    )
  else if (status === 'Planlanıyor')
    return (
      <div className="flex items-center justify-between mb-1">
        <Badge variant="secondary" className={` bg-slate-500/70 text-white rounded-lg gap-1`}>
          <Play></Play>
          <span className="text-md">{status}</span>
        </Badge>
      </div>
    )
  else if (status === 'İşleme Alındı')
    return (
      <div className="flex items-center justify-between mb-1">
        <Badge variant="secondary" className={` bg-slate-500/70 text-white rounded-lg gap-1`}>
          <Check></Check>
          <span className="text-md">{status}</span>
        </Badge>
      </div>
    )
  else if (status === 'Tamamlandı')
    return (
      <div className="flex items-center justify-between mb-1">
        <Badge variant="secondary" className={` bg-slate-500/70 text-white rounded-lg gap-1`}>
          <CheckCheck></CheckCheck>
          <span className="text-md">{status}</span>
        </Badge>
      </div>
    )
  else {
    return (
      <div className="flex items-center justify-between mb-1">
        <Badge
          variant="secondary"
          className={` bg-background-500/70 border border-dashed border-slate-500 text-white rounded-lg gap-1`}
        >
          <TriangleAlert />
          <span className="text-md">Durum Tanımsız</span>
        </Badge>
      </div>
    )
  }
}
