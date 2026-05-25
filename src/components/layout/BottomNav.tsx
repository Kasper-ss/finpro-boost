import { motion } from 'framer-motion'
import { LayoutDashboard, ArrowLeftRight, CheckSquare, TrendingUp, Sparkles } from 'lucide-react'
import { useAppStore } from '@/app/store'
import type { AppTab } from '@/types'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

const tabs: { id: AppTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Главная', icon: LayoutDashboard },
  { id: 'transactions', label: 'Операции', icon: ArrowLeftRight },
  { id: 'productivity', label: 'План', icon: CheckSquare },
  { id: 'investments', label: 'Инвест.', icon: TrendingUp },
  { id: 'ai', label: 'ИИ', icon: Sparkles },
]

export function BottomNav() {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom bg-surface-card/95 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptic('light')
                setActiveTab(id)
              }}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 min-w-[56px] rounded-xl transition-colors',
                active ? 'text-accent' : 'text-tg-hint'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-accent rounded-full"
                  style={{ position: 'relative', top: 0 }}
                />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
