import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useAppStore } from '@/app/store'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { TransactionForm } from '@/features/transactions/TransactionForm'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { filterTransactions, formatCurrency, formatDateShort, getCategoryLabel } from '@/lib/utils'
import type { TransactionCategory } from '@/types'
import { CATEGORY_META } from '@/types'
import { haptic } from '@/lib/telegram'

type Filter = 'all' | 'income' | 'expense' | TransactionCategory

export function TransactionsPage() {
  const transactions = useAppStore((s) => s.transactions)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(
    () => filterTransactions(transactions, filter, search, sort),
    [transactions, filter, search, sort]
  )

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'income', label: 'Доходы' },
    { id: 'expense', label: 'Расходы' },
  ]

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Операции</h1>
        <button
          type="button"
          onClick={() => {
            haptic('light')
            setModalOpen(true)
          }}
          className="p-3 rounded-xl bg-accent text-accent-text"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-card border border-white/10 text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              filter === f.id ? 'bg-accent text-accent-text' : 'bg-surface-card text-tg-hint'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Select
        label="Сортировка"
        options={[
          { value: 'date-desc', label: 'Дата ↓' },
          { value: 'date-asc', label: 'Дата ↑' },
          { value: 'amount-desc', label: 'Сумма ↓' },
          { value: 'amount-asc', label: 'Сумма ↑' },
        ]}
        value={sort}
        onChange={(e) => setSort(e.target.value as typeof sort)}
      />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-tg-hint py-8">Операций не найдено</p>
        ) : (
          filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card className="flex items-center gap-3 !p-3">
                <div
                  className={`p-2 rounded-xl ${
                    tx.type === 'income' ? 'bg-success/20' : 'bg-danger/20'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownLeft size={18} className="text-success" />
                  ) : (
                    <ArrowUpRight size={18} className="text-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-tg-hint">
                    <CategoryIcon category={tx.category} size={14} />
                    {getCategoryLabel(tx.category)} · {formatDateShort(tx.date)}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'income' ? 'text-success' : 'text-tg-text'}`}>
                    {tx.type === 'income' ? '+' : '−'}
                    {formatCurrency(tx.amount)}
                  </p>
                  {tx.taskId && <Badge variant="warning">Задача</Badge>}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Новая операция">
        <TransactionForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
