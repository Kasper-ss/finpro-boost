import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: number
  color?: string
  compact?: boolean
}

export function StatCard({ title, value, icon: Icon, trend, color = '#3b82f6', compact }: StatCardProps) {
  return (
    <Card className="min-w-[140px] flex-shrink-0">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-tg-hint">{title}</span>
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}22` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
        </div>
        <p className="text-lg font-bold">{formatCurrency(value, compact)}</p>
        {trend !== undefined && (
          <p className={cn('text-xs mt-1', trend >= 0 ? 'text-success' : 'text-danger')}>
            {trend >= 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </p>
        )}
      </motion.div>
    </Card>
  )
}
