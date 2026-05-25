import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatISO } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAppStore } from '@/app/store'
import { CATEGORY_META, type TransactionCategory } from '@/types'
import { haptic } from '@/lib/telegram'

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Сумма должна быть больше 0'),
  category: z.string(),
  date: z.string(),
  description: z.string().min(1, 'Укажите описание'),
  taskId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const categoryOptions = Object.values(CATEGORY_META).map((c) => ({
  value: c.id,
  label: c.label,
}))

interface TransactionFormProps {
  onSuccess: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const addTransaction = useAppStore((s) => s.addTransaction)
  const tasks = useAppStore((s) => s.tasks)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      category: 'food',
      date: formatISO(new Date(), { representation: 'date' }),
      description: '',
      taskId: '',
    },
  })

  const type = watch('type')

  const onSubmit = (data: FormData) => {
    addTransaction({
      type: data.type,
      amount: data.amount,
      category: data.category as TransactionCategory,
      date: data.date,
      description: data.description,
      taskId: data.taskId || undefined,
    })
    haptic('success')
    onSuccess()
  }

  const incomeCategories = categoryOptions.filter((c) =>
    ['salary', 'freelance', 'investment_income', 'other'].includes(c.value)
  )
  const expenseCategories = categoryOptions.filter(
    (c) => !['salary', 'freelance', 'investment_income'].includes(c.value)
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        {(['expense', 'income'] as const).map((t) => (
          <label
            key={t}
            className={`flex-1 text-center py-2 rounded-xl border cursor-pointer ${
              type === t ? 'border-accent bg-accent/20' : 'border-white/10'
            }`}
          >
            <input type="radio" value={t} {...register('type')} className="sr-only" />
            {t === 'income' ? 'Доход' : 'Расход'}
          </label>
        ))}
      </div>
      <Input label="Сумма, ₽" type="number" {...register('amount')} error={errors.amount?.message} />
      <Select
        label="Категория"
        options={type === 'income' ? incomeCategories : expenseCategories}
        {...register('category')}
      />
      <Input label="Дата" type="date" {...register('date')} error={errors.date?.message} />
      <Input label="Описание" {...register('description')} error={errors.description?.message} />
      <Select
        label="Связанная задача (необязательно)"
        options={[
          { value: '', label: '— Не выбрано —' },
          ...tasks.map((t) => ({ value: t.id, label: t.title })),
        ]}
        {...register('taskId')}
      />
      <Button type="submit" fullWidth disabled={isSubmitting}>
        Добавить операцию
      </Button>
    </form>
  )
}
