import { notFound } from 'next/navigation'
import { getModuleById } from '@/actions/modules'
import ModuleSwappy from '@/components/pages/modules/swappy/main'
interface Props {
  params: Promise<{ id: number }>
}
export default async function ModuleDetailCard({ params }: Props) {
  const id = (await params).id
  const module = await getModuleById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <ModuleSwappy module={module} />
}
