import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Share2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useAppStore } from '@/app/store'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { balanceHistory, expenseDistribution, MONTH_BALANCE_CHANGE_PERCENT } from '@/lib/mockData'
import { shareApp, haptic } from '@/lib/telegram'
import { generateAdvisorResponse } from '@/features/ai-advisor/advisorLogic'

export function DashboardPage() {
  const balance = useAppStore((s) => s.balance)
  const income = useAppStore((s) => s.income)
  const expenses = useAppStore((s) => s.expenses)
  const investmentsValue = useAppStore((s) => s.investmentsValue)
  const freeFunds = useAppStore((s) => s.freeFunds)
  const monthBalanceChange = useAppStore((s) => s.monthBalanceChange)
  const productivityStats = useAppStore((s) => s.productivityStats)
  const user = useAppStore((s) => s.user)
  const store = useAppStore()

  const aiTip = generateAdvisorResponse('Проанализируй мои финансы', store)
    .split('\n')
    .slice(0, 3)
    .join(' ')
    .replace(/\*\*/g, '')
    .slice(0, 120)

  return (
    <div className="p-4 space-y-4 pb-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-tg-hint">Привет, {user?.firstName ?? 'друг'} 👋</p>
          <h1 className="text-xl font-bold">FinPro Boost</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            haptic('light')
            shareApp('Попробуй FinPro Boost — умный финансовый помощник в Telegram!')
          }}
          className="p-3 rounded-xl bg-surface-card border border-white/10"
        >
          <Share2 size={20} />
        </button>
      </header>

      <Card glow className="!p-5">
        <p className="text-sm text-tg-hint mb-1">Общий баланс</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold mb-2"
        >
          {formatCurrency(balance)}
        </motion.p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-success flex items-center gap-1">
            <TrendingUp size={14} />+{formatCurrency(monthBalanceChange)}
          </span>
          <span className="text-tg-hint">за месяц · +{MONTH_BALANCE_CHANGE_PERCENT}%</span>
        </div>
        <div className="h-32 mt-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceHistory}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#8b92a8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#1a1d27', border: 'none', borderRadius: 12 }}
                formatter={(v: number) => [formatCurrency(v), 'Баланс']}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#balanceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <StatCard title="Доходы" value={income} icon={TrendingUp} color="#22c55e" compact />
        <StatCard title="Расходы" value={expenses} icon={TrendingDown} color="#ef4444" compact />
        <StatCard title="Инвестиции" value={investmentsValue} icon={PiggyBank} color="#8b5cf6" compact />
        <StatCard title="Свободно" value={freeFunds} icon={Wallet} color="#3b82f6" compact />
      </div>

      <Card>
        <h2 className="font-semibold mb-3">Расходы по категориям</h2>
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseDistribution} dataKey="value" innerRadius={32} outerRadius={48} paddingAngle={2}>
                  {expenseDistribution.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {expenseDistribution.slice(0, 4).map((e) => (
              <div key={e.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                  {e.name}
                </span>
                <span className="text-tg-hint">{formatCurrency(e.value, true)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Сегодняшняя продуктивность</h2>
          <CheckCircle2 size={18} className="text-success" />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="text-2xl font-bold">
            {productivityStats.completedToday}/{productivityStats.totalToday}
          </div>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-success rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(productivityStats.completedToday / Math.max(productivityStats.totalToday, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
        <p className="text-sm text-tg-hint">
          Финансовый эффект сегодня:{' '}
          <span className="text-success font-medium">
            +{formatCurrency(productivityStats.financialImpactToday)}
          </span>
        </p>
        <p className="text-xs text-tg-hint mt-1">Серия: {productivityStats.streakDays} дн. подряд 🔥</p>
      </Card>

      <Card className="border-accent/30 bg-accent/5">
        <div className="flex gap-3">
          <div className="p-2 rounded-xl bg-accent/20 h-fit">
            <Sparkles size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-accent font-medium mb-1">Рекомендация ИИ на день</p>
            <p className="text-sm leading-relaxed">{aiTip}…</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
