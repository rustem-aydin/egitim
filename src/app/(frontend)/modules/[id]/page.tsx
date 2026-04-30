import { notFound } from 'next/navigation'
import { getModuleById } from '@/actions/server/modules'
import ModuleDetails from '@/components/pages/modules/module-details'
interface Props {
  params: Promise<{ id: number }>
}
export default async function ModuleDetailCard({ params }: Props) {
  const id = (await params).id
  const module = await getModuleById(String(id))
  if (isNaN(id)) {
    notFound()
  }
  return <ModuleDetails module={module} />
}
