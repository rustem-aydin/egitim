import { Flag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Team } from '@/payload-types'

export const TeamFlag = ({ team, position }: { team: Team; position: 'top' | 'bottom' }) => (
  <motion.div
    className="absolute z-0 right-0 w-32 h-32 overflow-hidden"
    style={{ [position]: 0 }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 0.2, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div
      className="absolute -right-10 w-45 transform rotate-45 py-1 text-center text-white shadow-md"
      style={{
        backgroundColor: team.color ?? '#A9A9A9',
        top: position === 'top' ? '22px' : 'auto',
        bottom: position === 'bottom' ? '42px' : 'auto',
        transform: position === 'top' ? 'rotate(90deg)' : 'rotate(-90deg)',
      }}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Flag className="h-3 w-3" />
        <span className="text-xs font-bold uppercase tracking-wider">{team.name}</span>
      </div>
    </div>
  </motion.div>
)
