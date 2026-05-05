'use client'
import { Badge } from '@/components/ui/badge'

const BadgeModule = ({ code }: any) => {
  const char = String(code).charAt(0)
  if (char === 'C') {
    return (
      <Badge className="bg-red-500 rounded-md">
        <span className="text-primary-foreground text-sm font-semibold">{code}</span>
      </Badge>
    )
  } else if (char === 'B') {
    return (
      <Badge className="bg-amber-500 rounded-md">
        <span className="text-primary-foreground text-sm font-semibold">{code}</span>
      </Badge>
    )
  } else if (char === 'A') {
    return (
      <Badge className="bg-green-500 rounded-md">
        <span className="text-primary-foreground text-sm font-semibold">{code}</span>
      </Badge>
    )
  } else if (char === 'T') {
    return (
      <Badge className="bg-blue-500 rounded-md">
        <span className="text-primary-foreground text-sm font-semibold">{code}</span>
      </Badge>
    )
  } else if (char === 'K') {
    return (
      <Badge className="bg-linear-to-r from-blue-500 via-purple-600 rounded-md border-0">
        <span className=" text-sm font-semibold">{code}</span>
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-gray-500 rounded-md">
        <span className="text-primary-foreground text-sm font-semibold">{code}</span>
      </Badge>
    )
  }
}

export default BadgeModule
