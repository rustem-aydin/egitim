import { getDrillById } from '@/actions/server/drills'
import DrillDetails from '@/components/pages/drills/drill-details'
import { notFound } from 'next/navigation'
interface Props {
  params: Promise<{ id: number }>
}
const DrillDetailsPage = async ({ params }: Props) => {
  const id = (await params).id
  const drill = await getDrillById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <DrillDetails drill={drill} />
}

export default DrillDetailsPage
