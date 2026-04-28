'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface MotionProps {
  children: React.ReactNode
}
const MotionCard = ({ children }: MotionProps) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.2,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  )
}

export default MotionCard
