import { subDays, formatISO } from 'date-fns'
import type { Transaction, Task, Investment, ProductivityStats } from '@/types'

const d = (daysAgo: number) => formatISO(subDays(new Date(), daysAgo), { representation: 'date' })

export const INITIAL_BALANCE = 487_320
export const INITIAL_INCOME = 185_000
export const INITIAL_EXPENSES = 94_280
export const INITIAL_INVESTMENTS_VALUE = 312_450
export const INITIAL_FREE_FUNDS = 174_870
export const MONTH_BALANCE_CHANGE = 12_450
export const MONTH_BALANCE_CHANGE_PERCENT = 2.6

export const EMPTY_FINANCES = {
  balance: 0,
  income: 0,
  expenses: 0,
  investmentsValue: 0,
  freeFunds: 0,
  monthBalanceChange: 0,
} as const

export const EMPTY_PRODUCTIVITY_STATS: ProductivityStats = {
  completedToday: 0,
  totalToday: 0,
  financialImpactToday: 0,
  streakDays: 0,
}

export const initialTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 120000, category: 'salary', date: d(2), description: 'Зарплата — основная работа' },
  { id: 't2', type: 'expense', amount: 4500, category: 'food', date: d(0), description: 'Продукты в Перекрёстке' },
  { id: 't3', type: 'expense', amount: 890, category: 'transport', date: d(0), description: 'Яндекс Go' },
  { id: 't4', type: 'income', amount: 35000, category: 'freelance', date: d(5), description: 'Проект UI/UX для стартапа' },
  { id: 't5', type: 'expense', amount: 1990, category: 'subscriptions', date: d(1), description: 'Spotify + Notion' },
  { id: 't6', type: 'expense', amount: 12500, category: 'housing', date: d(3), description: 'Коммунальные платежи' },
  { id: 't7', type: 'expense', amount: 3200, category: 'entertainment', date: d(1), description: 'Кино и ужин' },
  { id: 't8', type: 'income', amount: 4200, category: 'investment_income', date: d(7), description: 'Дивиденды SBER' },
  { id: 't9', type: 'expense', amount: 15600, category: 'shopping', date: d(4), description: 'Одежда — осенняя коллекция' },
  { id: 't10', type: 'expense', amount: 2400, category: 'health', date: d(6), description: 'Аптека и витамины' },
  { id: 't11', type: 'expense', amount: 780, category: 'food', date: d(1), description: 'Кофе с собой' },
  { id: 't12', type: 'income', amount: 15000, category: 'freelance', date: d(10), description: 'Консультация по финансам' },
  { id: 't13', type: 'expense', amount: 4990, category: 'education', date: d(8), description: 'Курс по инвестициям' },
  { id: 't14', type: 'expense', amount: 2100, category: 'transport', date: d(2), description: 'Бензин' },
  { id: 't15', type: 'expense', amount: 6500, category: 'food', date: d(3), description: 'Доставка еды за неделю' },
  { id: 't16', type: 'income', amount: 8500, category: 'other', date: d(12), description: 'Возврат налога' },
  { id: 't17', type: 'expense', amount: 32000, category: 'housing', date: d(14), description: 'Аренда квартиры' },
  { id: 't18', type: 'expense', amount: 1450, category: 'subscriptions', date: d(9), description: 'ChatGPT Plus' },
  { id: 't19', type: 'expense', amount: 5400, category: 'entertainment', date: d(11), description: 'Концерт' },
  { id: 't20', type: 'income', amount: 2800, category: 'investment_income', date: d(15), description: 'Купоны ОФЗ' },
  { id: 't21', type: 'expense', amount: 8900, category: 'shopping', date: d(13), description: 'Электроника — наушники' },
  { id: 't22', type: 'expense', amount: 1100, category: 'food', date: d(2), description: 'Обед в офисе' },
  { id: 't23', type: 'expense', amount: 3600, category: 'health', date: d(16), description: 'Стоматолог — осмотр' },
  { id: 't24', type: 'income', amount: 22000, category: 'freelance', date: d(18), description: 'Разработка лендинга' },
  { id: 't25', type: 'expense', amount: 1750, category: 'transport', date: d(5), description: 'Метро + каршеринг' },
  { id: 't26', type: 'expense', amount: 4200, category: 'other', date: d(7), description: 'Подарок другу' },
  { id: 't27', type: 'expense', amount: 980, category: 'food', date: d(4), description: 'Пекарня' },
  { id: 't28', type: 'income', amount: 5600, category: 'investment_income', date: d(20), description: 'Продажа BTC (частично)' },
  { id: 't29', type: 'expense', amount: 7200, category: 'education', date: d(19), description: 'Книги и подписка Skillbox' },
  { id: 't30', type: 'expense', amount: 2850, category: 'entertainment', date: d(6), description: 'Игровая подписка PS+' },
]

export const initialTasks: Task[] = [
  {
    id: 'task1',
    title: 'Отменить неиспользуемые подписки',
    period: 'day',
    completed: false,
    financialEffect: { kind: 'avoid', amount: 800, label: 'избежать траты 800₽' },
    dueDate: d(0),
  },
  {
    id: 'task2',
    title: 'Перевести 15% зарплаты на накопительный счёт',
    period: 'day',
    completed: true,
    financialEffect: { kind: 'save', amount: 1500, label: '+1500₽ к сбережениям' },
    dueDate: d(0),
  },
  {
    id: 'task3',
    title: 'Составить список покупок на неделю',
    period: 'day',
    completed: false,
    financialEffect: { kind: 'avoid', amount: 1200, label: 'избежать импульсивных трат' },
    dueDate: d(0),
  },
  {
    id: 'task4',
    title: 'Проанализировать портфель и ребалансировать',
    period: 'week',
    completed: false,
    financialEffect: { kind: 'save', amount: 5000, label: 'оптимизация доходности' },
    dueDate: d(0),
  },
  {
    id: 'task5',
    title: 'Записать все расходы за день',
    period: 'day',
    completed: true,
    financialEffect: { kind: 'save', amount: 300, label: 'контроль бюджета' },
    dueDate: d(0),
  },
  {
    id: 'task6',
    title: 'Сравнить тарифы мобильного оператора',
    period: 'week',
    completed: false,
    financialEffect: { kind: 'avoid', amount: 450, label: 'экономия на связи' },
    dueDate: d(2),
  },
  {
    id: 'task7',
    title: 'Подготовить отчёт для налогового вычета',
    period: 'week',
    completed: false,
    financialEffect: { kind: 'save', amount: 13000, label: 'возврат до 13% НДФЛ' },
    dueDate: d(5),
  },
  {
    id: 'task8',
    title: 'Готовить обед дома 3 раза на неделе',
    period: 'week',
    completed: true,
    financialEffect: { kind: 'avoid', amount: 2400, label: 'меньше доставки еды' },
    dueDate: d(1),
  },
  {
    id: 'task9',
    title: 'Изучить ETF для диверсификации',
    period: 'week',
    completed: false,
    dueDate: d(3),
  },
  {
    id: 'task10',
    title: 'Настроить автоплатёж на брокерский счёт',
    period: 'day',
    completed: false,
    financialEffect: { kind: 'save', amount: 10000, label: 'регулярные инвестиции' },
    dueDate: d(0),
  },
]

export const initialInvestments: Investment[] = [
  { id: 'inv1', name: 'Сбербанк', symbol: 'SBER', type: 'stock', quantity: 50, buyPrice: 245, currentPrice: 278, currency: 'RUB' },
  { id: 'inv2', name: 'Яндекс', symbol: 'YDEX', type: 'stock', quantity: 8, buyPrice: 3200, currentPrice: 3580, currency: 'RUB' },
  { id: 'inv3', name: 'FXRL — российские акции', symbol: 'FXRL', type: 'fund', quantity: 120, buyPrice: 42, currentPrice: 48.5, currency: 'RUB' },
  { id: 'inv4', name: 'TMOS — технологии', symbol: 'TMOS', type: 'fund', quantity: 85, buyPrice: 6.2, currentPrice: 7.1, currency: 'RUB' },
  { id: 'inv5', name: 'Bitcoin', symbol: 'BTC', type: 'crypto', quantity: 0.012, buyPrice: 4200000, currentPrice: 4850000, currency: 'RUB' },
  { id: 'inv6', name: 'Ethereum', symbol: 'ETH', type: 'crypto', quantity: 0.15, buyPrice: 210000, currentPrice: 245000, currency: 'RUB' },
  { id: 'inv7', name: 'ОФЗ 26238', symbol: 'SU26238', type: 'fund', quantity: 15, buyPrice: 980, currentPrice: 1012, currency: 'RUB' },
  { id: 'inv8', name: 'Газпром', symbol: 'GAZP', type: 'stock', quantity: 200, buyPrice: 158, currentPrice: 172, currency: 'RUB' },
]

export const initialProductivityStats: ProductivityStats = {
  completedToday: 2,
  totalToday: 5,
  financialImpactToday: 1800,
  streakDays: 4,
}

export const balanceHistory = [
  { date: '1 мар', value: 452000 },
  { date: '8 мар', value: 461200 },
  { date: '15 мар', value: 468900 },
  { date: '22 мар', value: 475100 },
  { date: '29 мар', value: 481500 },
  { date: '5 апр', value: 474870 },
  { date: '12 апр', value: 487320 },
]

export const expenseDistribution = [
  { name: 'Жильё', value: 44500, color: '#eab308' },
  { name: 'Еда', value: 18200, color: '#f97316' },
  { name: 'Покупки', value: 24500, color: '#a855f7' },
  { name: 'Транспорт', value: 6200, color: '#06b6d4' },
  { name: 'Развлечения', value: 9850, color: '#ec4899' },
  { name: 'Прочее', value: 12030, color: '#64748b' },
]

export const portfolioHistory = [
  { date: 'Янв', value: 265000 },
  { date: 'Фев', value: 278400 },
  { date: 'Мар', value: 291200 },
  { date: 'Апр', value: 298100 },
  { date: 'Май', value: 305800 },
  { date: 'Июн', value: 312450 },
]
