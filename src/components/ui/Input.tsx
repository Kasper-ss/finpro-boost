import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-tg-hint">{label}</label>}
      <input
        className={cn(
          'w-full rounded-xl bg-surface-elevated border border-white/10 px-4 py-3 text-tg-text placeholder:text-tg-hint focus:outline-none focus:border-accent/50',
          error && 'border-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
