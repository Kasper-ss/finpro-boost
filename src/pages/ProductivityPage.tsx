import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, Circle, Gift, Plus } from 'lucide-react'
import { useAppStore } from '@/app/store'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from '@/features/productivity/TaskForm'
import { formatCurrency, isTaskForPeriod } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

export function ProductivityPage() {
  const tasks = useAppStore((s) => s.tasks)
  const toggleTask = useAppStore((s) => s.toggleTask)
  const [period, setPeriod] = useState<'day' | 'week'>('day')
  const [modalOpen, setModalOpen] = useState(false)

  const periodTasks = useMemo(
    () => tasks.filter((t) => isTaskForPeriod(t, period)),
    [tasks, period]
  )

  const incompleteWithEffect = tasks.filter((t) => !t.completed && t.financialEffect).slice(0, 3)
  const potential = incompleteWithEffect.reduce((s, t) => s + (t.financialEffect?.amount ?? 0), 0)

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Планировщик</h1>
        <button
          type="button"
          onClick={() => {
            haptic('light')
            setModalOpen(true)
          }}
          className="p-3 rounded-xl bg-accent text-accent-text"
          aria-label="Добавить задачу"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        {(['day', 'week'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium ${
              period === p ? 'bg-accent text-accent-text' : 'bg-surface-card text-tg-hint'
            }`}
          >
            {p === 'day' ? 'На сегодня' : 'На неделю'}
          </button>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
        <div className="flex gap-3">
          <Gift className="text-accent flex-shrink-0" />
          <p className="text-sm">
            {incompleteWithEffect.length >= 2 ? (
              <>
                Если выполнишь эти <strong>{incompleteWithEffect.length}</strong> задачи — сможешь
                позволить себе <span className="text-accent">{formatCurrency(potential)}</span> на
                цель месяца или отложить на инвестиции.
              </>
            ) : (
              <>Добавьте задачи на сегодня или на неделю — с финансовым эффектом или без.</>
            )}
          </p>
        </div>
      </Card>

      <div className="space-y-2">
        {periodTasks.length === 0 ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full py-8 rounded-2xl border border-dashed border-white/20 text-tg-hint text-sm"
          >
            Нет задач · Нажмите +, чтобы добавить
          </button>
        ) : (
          periodTasks.map((task) => (
            <motion.div key={task.id} layout>
              <Card
                onClick={() => {
                  haptic('light')
                  toggleTask(task.id)
                }}
                className={task.completed ? 'opacity-60' : ''}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 p-1 rounded-full ${
                      task.completed ? 'bg-success/30 text-success' : 'bg-white/10 text-tg-hint'
                    }`}
                  >
                    {task.completed ? <Check size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    {task.financialEffect && (
                      <p className="text-xs text-tg-hint mt-1">
                        Выполнить →{' '}
                        <span className={task.financialEffect.kind === 'save' ? 'text-success' : 'text-warning'}>
                          {task.financialEffect.label}
                        </span>
                      </p>
                    )}
                  </div>
                  {task.period === 'week' && <Badge>Неделя</Badge>}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Card>
        <p className="text-sm text-tg-hint mb-2">Прогресс ({period === 'day' ? 'день' : 'неделя'})</p>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{
              width: `${
                (periodTasks.filter((t) => t.completed).length / Math.max(periodTasks.length, 1)) *
                100
              }%`,
            }}
          />
        </div>
        <p className="text-xs text-tg-hint mt-2">
          {periodTasks.filter((t) => t.completed).length} из {periodTasks.length} выполнено
        </p>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={period === 'day' ? 'Задача на сегодня' : 'Задача на неделю'}
      >
        <TaskForm defaultPeriod={period} onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
