import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User,
  Transaction,
  Task,
  Investment,
  ProductivityStats,
  AppTab,
  TransactionCategory,
  TransactionType,
  ChatMessage,
  FinancialSnapshot,
} from '@/types'
import {
  INITIAL_BALANCE,
  INITIAL_INCOME,
  INITIAL_EXPENSES,
  INITIAL_INVESTMENTS_VALUE,
  INITIAL_FREE_FUNDS,
  initialTransactions,
  initialTasks,
  initialInvestments,
  initialProductivityStats,
  EMPTY_FINANCES,
  EMPTY_PRODUCTIVITY_STATS,
} from '@/lib/mockData'
import { generateId, calcPortfolioValue, isTaskForPeriod } from '@/lib/utils'
import { getTelegramUser } from '@/lib/telegram'

interface AppState extends FinancialSnapshot {
  user: User | null
  financesManual: boolean
  transactions: Transaction[]
  tasks: Task[]
  investments: Investment[]
  productivityStats: ProductivityStats
  theme: 'dark' | 'light'
  activeTab: AppTab
  chatMessages: ChatMessage[]

  setActiveTab: (tab: AppTab) => void
  initUser: () => void
  completeOnboarding: () => void
  setTheme: (theme: 'dark' | 'light') => void
  setManualFinances: (values: FinancialSnapshot) => void
  resetFinancialCounters: () => void
  resetDemoData: () => void
  syncFinancesFromData: () => void
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  toggleTask: (id: string) => void
  addTask: (task: Omit<Task, 'id'>) => void
  addInvestment: (inv: Omit<Investment, 'id'>) => void
  addChatMessage: (role: 'user' | 'assistant', content: string) => void
  recalcFinances: () => void
}

function buildDefaultUser(): User {
  const tg = getTelegramUser()
  if (tg) {
    return {
      id: tg.id,
      firstName: tg.firstName,
      lastName: tg.lastName,
      username: tg.username,
      photoUrl: tg.photoUrl,
      onboardingCompleted: false,
    }
  }
  return {
    id: 1,
    firstName: 'Алексей',
    lastName: 'Фокс',
    username: 'demo_user',
    onboardingCompleted: false,
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      financesManual: false,
      balance: INITIAL_BALANCE,
      income: INITIAL_INCOME,
      expenses: INITIAL_EXPENSES,
      investmentsValue: INITIAL_INVESTMENTS_VALUE,
      freeFunds: INITIAL_FREE_FUNDS,
      monthBalanceChange: 12_450,
      transactions: initialTransactions,
      tasks: initialTasks,
      investments: initialInvestments,
      productivityStats: initialProductivityStats,
      theme: 'dark',
      activeTab: 'dashboard',
      chatMessages: [],

      setActiveTab: (tab) => set({ activeTab: tab }),

      initUser: () => {
        const { user } = get()
        if (!user) set({ user: buildDefaultUser() })
      },

      completeOnboarding: () =>
        set((s) => ({
          user: s.user ? { ...s.user, onboardingCompleted: true } : null,
        })),

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
      },

      setManualFinances: (values) =>
        set({
          ...values,
          financesManual: true,
        }),

      resetFinancialCounters: () =>
        set({
          ...EMPTY_FINANCES,
          financesManual: true,
        }),

      resetDemoData: () =>
        set({
          transactions: [],
          tasks: [],
          investments: [],
          chatMessages: [],
          productivityStats: EMPTY_PRODUCTIVITY_STATS,
          ...EMPTY_FINANCES,
          financesManual: true,
        }),

      syncFinancesFromData: () => {
        set({ financesManual: false })
        get().recalcFinances()
      },

      addTransaction: (data) => {
        const tx: Transaction = { ...data, id: generateId() }
        set((s) => ({ transactions: [tx, ...s.transactions] }))
        if (!get().financesManual) get().recalcFinances()
      },

      toggleTask: (id) => {
        set((s) => {
          const tasks = s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
          const dayTasks = tasks.filter((t) => t.period === 'day')
          const completedToday = dayTasks.filter((t) => t.completed).length
          const totalToday = dayTasks.length
          const financialImpactToday = dayTasks
            .filter((t) => t.completed && t.financialEffect)
            .reduce((sum, t) => sum + (t.financialEffect?.amount ?? 0), 0)
          return {
            tasks,
            productivityStats: {
              ...s.productivityStats,
              completedToday,
              totalToday,
              financialImpactToday,
            },
          }
        })
      },

      addTask: (task) => {
        const newTask = { ...task, id: generateId() }
        set((s) => {
          const tasks = [...s.tasks, newTask]
          const dayTasks = tasks.filter((t) => isTaskForPeriod(t, 'day'))
          return {
            tasks,
            productivityStats: {
              ...s.productivityStats,
              completedToday: dayTasks.filter((t) => t.completed).length,
              totalToday: dayTasks.length,
              financialImpactToday: dayTasks
                .filter((t) => t.completed && t.financialEffect)
                .reduce((sum, t) => sum + (t.financialEffect?.amount ?? 0), 0),
            },
          }
        })
      },

      addInvestment: (inv) => {
        set((s) => ({
          investments: [...s.investments, { ...inv, id: generateId() }],
        }))
        if (!get().financesManual) {
          const value = calcPortfolioValue(get().investments)
          set({ investmentsValue: value })
          get().recalcFinances()
        }
      },

      addChatMessage: (role, content) =>
        set((s) => ({
          chatMessages: [
            ...s.chatMessages,
            { id: generateId(), role, content, timestamp: new Date().toISOString() },
          ],
        })),

      recalcFinances: () => {
        if (get().financesManual) return

        const { transactions, investments } = get()
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((s, t) => s + t.amount, 0)
        const expenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0)
        const invValue = calcPortfolioValue(investments)
        const balance = income - expenses + invValue
        set({
          income,
          expenses,
          investmentsValue: invValue,
          freeFunds: Math.max(0, balance - invValue),
          balance,
        })
      },
    }),
    {
      name: 'finpro-boost-storage',
      partialize: (state) => ({
        user: state.user,
        financesManual: state.financesManual,
        balance: state.balance,
        income: state.income,
        expenses: state.expenses,
        investmentsValue: state.investmentsValue,
        freeFunds: state.freeFunds,
        monthBalanceChange: state.monthBalanceChange,
        transactions: state.transactions,
        tasks: state.tasks,
        investments: state.investments,
        productivityStats: state.productivityStats,
        theme: state.theme,
        chatMessages: state.chatMessages,
      }),
    }
  )
)

export type { TransactionType, TransactionCategory }
