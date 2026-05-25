export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'salary'
  | 'freelance'
  | 'investment_income'
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'subscriptions'
  | 'education'
  | 'other'

export interface User {
  id: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  onboardingCompleted: boolean
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  date: string
  description: string
  taskId?: string
}

export type TaskPeriod = 'day' | 'week'

export type TaskFinancialEffect =
  | { kind: 'save'; amount: number; label: string }
  | { kind: 'avoid'; amount: number; label: string }

export interface Task {
  id: string
  title: string
  period: TaskPeriod
  completed: boolean
  financialEffect?: TaskFinancialEffect
  dueDate?: string
}

export type InvestmentType = 'stock' | 'fund' | 'crypto'

export interface Investment {
  id: string
  name: string
  symbol: string
  type: InvestmentType
  quantity: number
  buyPrice: number
  currentPrice: number
  currency: string
}

export interface ProductivityStats {
  completedToday: number
  totalToday: number
  financialImpactToday: number
  streakDays: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type AppTab = 'dashboard' | 'transactions' | 'productivity' | 'investments' | 'ai'

export interface CategoryMeta {
  id: TransactionCategory
  label: string
  icon: string
  color: string
}

export const CATEGORY_META: Record<TransactionCategory, CategoryMeta> = {
  salary: { id: 'salary', label: 'Зарплата', icon: 'Wallet', color: '#22c55e' },
  freelance: { id: 'freelance', label: 'Фриланс', icon: 'Laptop', color: '#3b82f6' },
  investment_income: { id: 'investment_income', label: 'Дивиденды', icon: 'TrendingUp', color: '#8b5cf6' },
  food: { id: 'food', label: 'Еда', icon: 'Utensils', color: '#f97316' },
  transport: { id: 'transport', label: 'Транспорт', icon: 'Car', color: '#06b6d4' },
  housing: { id: 'housing', label: 'Жильё', icon: 'Home', color: '#eab308' },
  entertainment: { id: 'entertainment', label: 'Развлечения', icon: 'Gamepad2', color: '#ec4899' },
  health: { id: 'health', label: 'Здоровье', icon: 'Heart', color: '#ef4444' },
  shopping: { id: 'shopping', label: 'Покупки', icon: 'ShoppingBag', color: '#a855f7' },
  subscriptions: { id: 'subscriptions', label: 'Подписки', icon: 'Repeat', color: '#64748b' },
  education: { id: 'education', label: 'Образование', icon: 'GraduationCap', color: '#14b8a6' },
  other: { id: 'other', label: 'Прочее', icon: 'MoreHorizontal', color: '#94a3b8' },
}
