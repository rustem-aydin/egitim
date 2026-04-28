import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import Link from 'next/link'
import { Layers } from 'lucide-react'
interface LinkProps {
  route: string
  id: number
  color?: string
}
const DetailLink = ({ route, id, color }: LinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="z-10" asChild>
          <Link
            href={`${'/' + route + '/' + id}`}
            className="p-2  rounded-md  border border-sidebar"
          >
            <Layers className={color} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Detaylara Git</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default DetailLink
