import Link from 'next/link'
import { Lesson, Module } from '@/payload-types'
import BadgeModule from '../modules/modules-badge-code'
interface Props {
  lesson: Lesson
}
const UserLessons = ({ lesson }: Props) => {
  return (
    <Link
      href={'/lessons/' + lesson?.id}
      key={lesson?.id}
      className="flex items-center gap-2  hover:underline text-sm"
    >
      <BadgeModule code={(lesson?.module as Module).code} />
      <span className=" text-md text-muted-foreground">{lesson?.lesson_name}</span>
    </Link>
  )
}

export default UserLessons
