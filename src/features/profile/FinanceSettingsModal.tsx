import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/app/store'
import { haptic } from '@/lib/telegram'

const schema = z.object({
  balance: z.coerce.number().min(0),
  income: z.coerce.number().min(0),
  expenses: z.coerce.number().min(0),
  investmentsValue: z.coerce.number().min(0),
  freeFunds: z.coerce.number().min(0),
  monthBalanceChange: z.coerce.number(),
})

type FormData = z.infer<typeof schema>

interface FinanceSettingsModalProps {
  open: boolean
  onClose: () => void
}

export function FinanceSettingsModal({ open, onClose }: FinanceSettingsModalProps) {
  const balance = useAppStore((s) => s.balance)
  const income = useAppStore((s) => s.income)
  const expenses = useAppStore((s) => s.expenses)
  const investmentsValue = useAppStore((s) => s.investmentsValue)
  const freeFunds = useAppStore((s) => s.freeFunds)
  const monthBalanceChange = useAppStore((s) => s.monthBalanceChange)
  const financesManual = useAppStore((s) => s.financesManual)
  const setManualFinances = useAppStore((s) => s.setManualFinances)
  const resetFinancialCounters = useAppStore((s) => s.resetFinancialCounters)
  const resetDemoData = useAppStore((s) => s.resetDemoData)
  const syncFinancesFromData = useAppStore((s) => s.syncFinancesFromData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      balance,
      income,
      expenses,
      investmentsValue,
      freeFunds,
      monthBalanceChange,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        balance,
        income,
        expenses,
        investmentsValue,
        freeFunds,
        monthBalanceChange,
      })
    }
  }, [open, balance, income, expenses, investmentsValue, freeFunds, monthBalanceChange, reset])

  const onSave = (data: FormData) => {
    setManualFinances(data)
    haptic('success')
    onClose()
  }

  const handleResetCounters = () => {
    if (!confirm('Обнулить доходы, расходы, инвестиции и свободные средства?')) return
    resetFinancialCounters()
    reset(EMPTY_FORM)
    haptic('success')
  }

  const handleResetDemo = () => {
    if (
      !confirm(
        'Удалить все демо-операции, задачи и портфель? Показатели будут обнулены — вы сможете ввести свои данные.'
      )
    )
      return
    resetDemoData()
    reset(EMPTY_FORM)
    haptic('success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Мои финансы">
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={financesManual ? 'success' : 'warning'}>
            {financesManual ? 'Ваши значения' : 'Из демо-данных'}
          </Badge>
          {!financesManual && (
            <p className="text-xs text-tg-hint w-full">
              Сейчас цифры считаются из операций и портфеля. Обнулите или сохраните свои — они не будут
              перезаписываться.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-3">
          <Input
            label="Общий баланс, ₽"
            type="number"
            {...register('balance')}
            error={errors.balance?.message}
          />
          <Input label="Доходы, ₽" type="number" {...register('income')} error={errors.income?.message} />
          <Input label="Расходы, ₽" type="number" {...register('expenses')} error={errors.expenses?.message} />
          <Input
            label="Инвестиции, ₽"
            type="number"
            {...register('investmentsValue')}
            error={errors.investmentsValue?.message}
          />
          <Input
            label="Свободные средства, ₽"
            type="number"
            {...register('freeFunds')}
            error={errors.freeFunds?.message}
          />
          <Input
            label="Изменение баланса за месяц, ₽"
            type="number"
            {...register('monthBalanceChange')}
            error={errors.monthBalanceChange?.message}
          />
          <Button type="submit" fullWidth>
            Сохранить мои показатели
          </Button>
        </form>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <Button type="button" variant="secondary" fullWidth onClick={handleResetCounters}>
            Обнулить показатели
          </Button>
          <Button type="button" variant="danger" fullWidth onClick={handleResetDemo}>
            Сбросить все демо-данные
          </Button>
          {financesManual && (
            <Button type="button" variant="ghost" fullWidth onClick={() => syncFinancesFromData()}>
              Считать снова из операций
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

const EMPTY_FORM: FormData = {
  balance: 0,
  income: 0,
  expenses: 0,
  investmentsValue: 0,
  freeFunds: 0,
  monthBalanceChange: 0,
}
