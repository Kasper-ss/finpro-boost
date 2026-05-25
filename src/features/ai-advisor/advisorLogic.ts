import type { Transaction, Task, Investment } from '@/types'

interface Snapshot {
  balance: number
  income: number
  expenses: number
  investmentsValue: number
  freeFunds: number
  transactions: Transaction[]
  tasks: Task[]
  investments: Investment[]
}

export const QUICK_QUESTIONS = [
  'Как я могу сэкономить в этом месяце?',
  'Стоит ли мне сейчас инвестировать?',
  'Проанализируй мои финансы',
] as const

export function generateAdvisorResponse(question: string, data: Snapshot): string {
  const q = question.toLowerCase()
  const savingsRate =
    data.income > 0 ? ((data.income - data.expenses) / data.income) * 100 : 0
  const pendingTasks = data.tasks.filter((t) => !t.completed && t.financialEffect)
  const potentialSave = pendingTasks.reduce((s, t) => s + (t.financialEffect?.amount ?? 0), 0)
  const topExpense = getTopExpenseCategory(data.transactions)

  if (q.includes('сэконом') || q.includes('эконом')) {
    return `📊 **Анализ расходов**

Ваши расходы за период: **${formatRub(data.expenses)}** при доходе **${formatRub(data.income)}**. Норма сбережений: **${savingsRate.toFixed(1)}%**.

💡 **Рекомендации:**
1. Самая крупная категория трат — **${topExpense}**. Попробуйте сократить на 10–15%.
2. У вас **${pendingTasks.length}** задач с финансовым эффектом — выполнение даст потенциал **~${formatRub(potentialSave)}**.
3. Отмените неиспользуемые подписки (у вас уже есть задача в планировщике).

🎯 Цель на месяц: увеличить свободные средства с **${formatRub(data.freeFunds)}** до **${formatRub(data.freeFunds + potentialSave * 0.6)}**.`
  }

  if (q.includes('инвестир') || q.includes('вклад')) {
    const portfolioShare = data.balance > 0 ? (data.investmentsValue / data.balance) * 100 : 0
    const shouldInvest = data.freeFunds > 50000 && savingsRate > 15
    return `📈 **Инвестиционный обзор**

Портфель: **${formatRub(data.investmentsValue)}** (${portfolioShare.toFixed(0)}% от капитала). Свободные средства: **${formatRub(data.freeFunds)}**.

${shouldInvest ? '✅ **Да, сейчас уместно инвестировать** — у вас достаточная подушка и положительный cash flow. Рекомендую DCA: 10–15% свободных средств ежемесячно в FXRL/TMOS.' : '⚠️ **Пока лучше подождать** — нарастите резерв до 3 месяцев расходов (~' + formatRub(data.expenses * 3) + '), затем начните с 5% от свободных средств.'}

Активов в портфеле: **${data.investments.length}**. Диверсификация: акции, фонды, крипта — хороший баланс.`
  }

  if (q.includes('анализ') || q.includes('финанс')) {
    return `🔍 **Финансовый портрет**

| Показатель | Значение |
|------------|----------|
| Баланс | ${formatRub(data.balance)} |
| Доходы | ${formatRub(data.income)} |
| Расходы | ${formatRub(data.expenses)} |
| Инвестиции | ${formatRub(data.investmentsValue)} |
| Свободно | ${formatRub(data.freeFunds)} |

**Оценка:** ${savingsRate >= 20 ? '🟢 Отличное финансовое здоровье' : savingsRate >= 10 ? '🟡 Стабильно, есть куда расти' : '🔴 Стоит сократить расходы'}

**Топ-3 действия:**
1. Выполните задачи планировщика (+${formatRub(potentialSave)} потенциал)
2. Оптимизируйте категорию «${topExpense}»
3. Настройте автоперевод 10% на инвестиции

Вопросы по конкретным категориям — спрашивайте!`
  }

  return `Спасибо за вопрос! На основе ваших данных: баланс **${formatRub(data.balance)}**, норма сбережений **${savingsRate.toFixed(1)}%**.

Попробуйте быстрые вопросы выше — я дам развёрнутый анализ по экономии, инвестициям или общему состоянию финансов.`
}

function formatRub(n: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)
}

function getTopExpenseCategory(transactions: Snapshot['transactions']): string {
  const map = new Map<string, number>()
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount))
  let top = 'прочее'
  let max = 0
  map.forEach((v, k) => {
    if (v > max) {
      max = v
      top = k
    }
  })
  const labels: Record<string, string> = {
    housing: 'Жильё',
    food: 'Еда',
    shopping: 'Покупки',
    transport: 'Транспорт',
    entertainment: 'Развлечения',
    subscriptions: 'Подписки',
    health: 'Здоровье',
    education: 'Образование',
    other: 'Прочее',
  }
  return labels[top] ?? top
}
