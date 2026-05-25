import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  glow?: boolean
}

export function Card({ children, className, onClick, glow }: CardProps) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-surface-card p-4 shadow-card border border-white/5',
        glow && 'shadow-glow border-accent/20',
        onClick && 'w-full text-left',
        className
      )}
    >
      {children}
    </Comp>
  )
}
