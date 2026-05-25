import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Bitcoin, Building2, Layers } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/app/store'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, calcPortfolioValue, percentChange } from '@/lib/utils'
import { portfolioHistory } from '@/lib/mockData'
import type { InvestmentType } from '@/types'
import { haptic } from '@/lib/telegram'

const invSchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1),
  type: z.enum(['stock', 'fund', 'crypto']),
  quantity: z.coerce.number().positive(),
  buyPrice: z.coerce.number().positive(),
  currentPrice: z.coerce.number().positive(),
})

type InvForm = z.infer<typeof invSchema>

const typeIcons: Record<InvestmentType, typeof TrendingUp> = {
  stock: Building2,
  fund: Layers,
  crypto: Bitcoin,
}

const typeLabels: Record<InvestmentType, string> = {
  stock: 'Акция',
  fund: 'Фонд',
  crypto: 'Крипто',
}

export function InvestmentsPage() {
  const investments = useAppStore((s) => s.investments)
  const addInvestment = useAppStore((s) => s.addInvestment)
  const [modalOpen, setModalOpen] = useState(false)

  const total = calcPortfolioValue(investments)
  const totalCost = investments.reduce((s, i) => s + i.quantity * i.buyPrice, 0)
  const pnl = percentChange(total, totalCost)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvForm>({
    resolver: zodResolver(invSchema),
    defaultValues: { type: 'stock', quantity: 1, buyPrice: 100, currentPrice: 100 },
  })

  const onSubmit = (data: InvForm) => {
    addInvestment({ ...data, currency: 'RUB' })
    haptic('success')
    reset()
    setModalOpen(false)
  }

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Инвестиции</h1>
        <button
          type="button"
          onClick={() => {
            haptic('light')
            setModalOpen(true)
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-accent text-accent-text text-sm"
        >
          <Plus size={18} /> Актив
        </button>
      </div>

      <Card glow>
        <p className="text-sm text-tg-hint">Стоимость портфеля</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(total)}</p>
        <p className={`text-sm mt-1 ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
          {pnl >= 0 ? '+' : ''}
          {pnl.toFixed(2)}% от вложений
        </p>
        <div className="h-36 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioHistory}>
              <XAxis dataKey="date" tick={{ fill: '#8b92a8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1d27', border: 'none', borderRadius: 12 }}
                formatter={(v: number) => [formatCurrency(v), 'Портфель']}
              />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-2">
        {investments.map((inv, i) => {
          const value = inv.quantity * inv.currentPrice
          const cost = inv.quantity * inv.buyPrice
          const change = percentChange(value, cost)
          const Icon = typeIcons[inv.type]
          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="!p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <Icon size={20} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{inv.name}</p>
                      <Badge>{typeLabels[inv.type]}</Badge>
                    </div>
                    <p className="text-xs text-tg-hint">
                      {inv.quantity} × {formatCurrency(inv.currentPrice)} · {inv.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(value, true)}</p>
                    <p className={`text-xs ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {change >= 0 ? '+' : ''}
                      {change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Добавить актив">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Название" {...register('name')} error={errors.name?.message} />
          <Input label="Тикер" {...register('symbol')} error={errors.symbol?.message} />
          <Select
            label="Тип"
            options={[
              { value: 'stock', label: 'Акция' },
              { value: 'fund', label: 'Фонд' },
              { value: 'crypto', label: 'Крипто' },
            ]}
            {...register('type')}
          />
          <Input label="Количество" type="number" step="any" {...register('quantity')} />
          <Input label="Цена покупки" type="number" {...register('buyPrice')} />
          <Input label="Текущая цена" type="number" {...register('currentPrice')} />
          <Button type="submit" fullWidth>
            Добавить
          </Button>
        </form>
      </Modal>
    </div>
  )
}
