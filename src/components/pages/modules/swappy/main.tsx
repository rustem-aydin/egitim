import { SwappyProps } from '@/types/types'
import ModuleDetails from './cards/module-details'
import MainSwappy from '@/components/ui/main-swappy'
import { Module } from '@/payload-types'
import Fallback from '@/components/fallback'

export default function ModuleSwappy({ module }: { module: Module }) {
  const initialItems: SwappyProps[] = [
    {
      id: '1',
      title: '1',
      widgets: <ModuleDetails module={module} />,
      className: 'lg:col-span-8 h-full sm:col-span-7 col-span-12',
    },
    {
      id: '2',
      title: '2',
      widgets: <ModuleDetails module={module} />,
      className: 'lg:col-span-4 sm:col-span-7 col-span-12',
    },
  ]
  return (
    <div className="max-w-6xl w-full mx-auto p-4">
      <Fallback />
      <MainSwappy items={initialItems} />
    </div>
  )
}
