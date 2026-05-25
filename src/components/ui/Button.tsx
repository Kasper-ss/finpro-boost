import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-accent text-accent-text shadow-glow',
    secondary: 'bg-surface-elevated text-tg-text border border-white/10',
    ghost: 'bg-transparent text-tg-link',
    danger: 'bg-danger/20 text-danger',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        'font-medium transition-opacity disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
