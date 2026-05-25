import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  glow?: boolean
}

const cardClassName = (glow?: boolean, onClick?: () => void, className?: string) =>
  cn(
    'rounded-2xl bg-surface-card p-4 shadow-card border border-white/5',
    glow && 'shadow-glow border-accent/20',
    onClick && 'w-full text-left transition-transform active:scale-[0.98]',
    className
  )

export function Card({ children, className, onClick, glow }: CardProps) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClassName(glow, onClick, className)}>
        {children}
      </button>
    )
  }

  return <div className={cardClassName(glow, undefined, className)}>{children}</div>
}
