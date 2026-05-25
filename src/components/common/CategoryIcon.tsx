import {
  Wallet,
  Laptop,
  TrendingUp,
  Utensils,
  Car,
  Home,
  Gamepad2,
  Heart,
  ShoppingBag,
  Repeat,
  GraduationCap,
  MoreHorizontal,
  Circle,
} from 'lucide-react'
import type { TransactionCategory } from '@/types'
import { CATEGORY_META } from '@/types'

const icons = {
  Wallet,
  Laptop,
  TrendingUp,
  Utensils,
  Car,
  Home,
  Gamepad2,
  Heart,
  ShoppingBag,
  Repeat,
  GraduationCap,
  MoreHorizontal,
} as const

export function CategoryIcon({
  category,
  size = 18,
}: {
  category: TransactionCategory
  size?: number
}) {
  const meta = CATEGORY_META[category]
  const Icon = icons[meta.icon as keyof typeof icons] ?? Circle
  return <Icon size={size} style={{ color: meta.color }} />
}
