import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/app/store'
import { AppShell } from '@/components/layout/AppShell'
import { Onboarding } from '@/features/auth/Onboarding'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { ProductivityPage } from '@/pages/ProductivityPage'
import { InvestmentsPage } from '@/pages/InvestmentsPage'
import { AIAdvisorPage } from '@/pages/AIAdvisorPage'

const pages = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  productivity: ProductivityPage,
  investments: InvestmentsPage,
  ai: AIAdvisorPage,
} as const

function App() {
  const user = useAppStore((s) => s.user)
  const activeTab = useAppStore((s) => s.activeTab)
  const initUser = useAppStore((s) => s.initUser)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)

  useEffect(() => {
    initUser()
    setTheme(theme)
  }, [initUser, setTheme, theme])

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-surface">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        </motion.div>
      </div>
    )
  }

  if (!user.onboardingCompleted) {
    return <Onboarding />
  }

  const Page = pages[activeTab]

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className={activeTab === 'ai' ? 'h-full' : ''}
        >
          <Page />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}

export default App
