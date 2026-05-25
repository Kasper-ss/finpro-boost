import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-tg-hint">{label}</label>}
      <select
        className={cn(
          'w-full rounded-xl bg-surface-elevated border border-white/10 px-4 py-3 text-tg-text focus:outline-none focus:border-accent/50 appearance-none',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
