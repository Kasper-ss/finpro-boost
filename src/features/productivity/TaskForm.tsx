import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatISO } from 'date-fns'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAppStore } from '@/app/store'
import type { TaskPeriod, TaskFinancialEffect } from '@/types'
import { haptic } from '@/lib/telegram'

const schema = z
  .object({
    title: z.string().min(1, 'Введите название задачи'),
    period: z.enum(['day', 'week']),
    dueDate: z.string(),
    effectType: z.enum(['none', 'save', 'avoid']),
    effectAmount: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.effectType !== 'none' && (!data.effectAmount || data.effectAmount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите сумму эффекта',
        path: ['effectAmount'],
      })
    }
  })

type FormData = z.infer<typeof schema>

interface TaskFormProps {
  defaultPeriod: TaskPeriod
  onSuccess: () => void
}

function buildFinancialEffect(type: FormData['effectType'], amount: number): TaskFinancialEffect | undefined {
  if (type === 'none') return undefined
  if (type === 'save') {
    return {
      kind: 'save',
      amount,
      label: `+${amount.toLocaleString('ru-RU')}₽ к сбережениям`,
    }
  }
  return {
    kind: 'avoid',
    amount,
    label: `избежать траты ${amount.toLocaleString('ru-RU')}₽`,
  }
}

export function TaskForm({ defaultPeriod, onSuccess }: TaskFormProps) {
  const addTask = useAppStore((s) => s.addTask)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      period: defaultPeriod,
      dueDate: formatISO(new Date(), { representation: 'date' }),
      effectType: 'none',
      effectAmount: undefined,
    },
  })

  const effectType = watch('effectType')

  const onSubmit = (data: FormData) => {
    const effect =
      data.effectType !== 'none' && data.effectAmount
        ? buildFinancialEffect(data.effectType, data.effectAmount)
        : undefined

    addTask({
      title: data.title,
      period: data.period,
      completed: false,
      dueDate: data.dueDate,
      financialEffect: effect,
    })
    haptic('success')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Задача" placeholder="Например: отменить подписки" {...register('title')} error={errors.title?.message} />

      <Select
        label="Период"
        options={[
          { value: 'day', label: 'На сегодня' },
          { value: 'week', label: 'На неделю' },
        ]}
        {...register('period')}
      />

      <Input label="Дата" type="date" {...register('dueDate')} error={errors.dueDate?.message} />

      <Select
        label="Финансовый эффект"
        options={[
          { value: 'none', label: 'Без эффекта' },
          { value: 'save', label: 'Сбережения (+)' },
          { value: 'avoid', label: 'Избежать траты (−)' },
        ]}
        {...register('effectType')}
      />

      {effectType !== 'none' && (
        <Input
          label="Сумма, ₽"
          type="number"
          {...register('effectAmount')}
          error={errors.effectAmount?.message}
        />
      )}

      <Button type="submit" fullWidth disabled={isSubmitting}>
        Добавить задачу
      </Button>
    </form>
  )
}
