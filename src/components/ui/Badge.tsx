import { cn } from '@/lib/utils'

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning'
  className?: string
}) {
  const variants = {
    default: 'bg-white/10 text-tg-text',
    success: 'bg-success/20 text-success',
    danger: 'bg-danger/20 text-danger',
    warning: 'bg-warning/20 text-warning',
  }
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-lg text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
