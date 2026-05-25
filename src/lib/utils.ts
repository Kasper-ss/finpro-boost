import { format, formatDistanceToNow, parseISO, isToday, isThisWeek } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { Transaction, TransactionCategory } from '@/types'
import { CATEGORY_META } from '@/types'

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ₽`
  }
  if (compact && Math.abs(amount) >= 10_000) {
    return `${(amount / 1_000).toFixed(0)}K ₽`
  }
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'd MMM yyyy', { locale: ru })
}

export function formatDateShort(date: string): string {
  const d = parseISO(date)
  if (isToday(d)) return 'Сегодня'
  return format(d, 'd MMM', { locale: ru })
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ru })
}

export function getCategoryLabel(category: TransactionCategory): string {
  return CATEGORY_META[category]?.label ?? category
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function filterTransactions(
  transactions: Transaction[],
  filter: 'all' | 'income' | 'expense' | TransactionCategory,
  search: string,
  sort: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
): Transaction[] {
  let result = [...transactions]

  if (filter === 'income') result = result.filter((t) => t.type === 'income')
  else if (filter === 'expense') result = result.filter((t) => t.type === 'expense')
  else if (filter !== 'all') result = result.filter((t) => t.category === filter)

  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        getCategoryLabel(t.category).toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => {
    if (sort === 'date-desc') return b.date.localeCompare(a.date)
    if (sort === 'date-asc') return a.date.localeCompare(b.date)
    if (sort === 'amount-desc') return b.amount - a.amount
    return a.amount - b.amount
  })

  return result
}

export function calcPortfolioValue(
  investments: { quantity: number; currentPrice: number }[]
): number {
  return investments.reduce((sum, i) => sum + i.quantity * i.currentPrice, 0)
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function isTaskForPeriod(
  task: { period: 'day' | 'week'; dueDate?: string },
  period: 'day' | 'week'
): boolean {
  if (task.period !== period) return false
  if (!task.dueDate) return true
  const d = parseISO(task.dueDate)
  return period === 'day' ? isToday(d) : isThisWeek(d, { weekStartsOn: 1 })
}
