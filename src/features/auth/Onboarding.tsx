import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Target, Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/app/store'
import { haptic } from '@/lib/telegram'

const slides = [
  {
    icon: TrendingUp,
    title: 'Финансы под контролем',
    text: 'Отслеживайте доходы, расходы и инвестиции в одном премиальном интерфейсе.',
  },
  {
    icon: Target,
    title: 'Продуктивность = деньги',
    text: 'Каждая задача может принести сбережения или помочь избежать лишних трат.',
  },
  {
    icon: Sparkles,
    title: 'ИИ-советник',
    text: 'Персональные рекомендации на основе ваших реальных данных.',
  },
]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const slide = slides[step]
  const Icon = slide.icon

  const next = () => {
    haptic('light')
    if (step < slides.length - 1) setStep(step + 1)
    else {
      haptic('success')
      completeOnboarding()
    }
  }

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-surface safe-bottom">
      <div className="flex gap-2 pt-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center mb-8 shadow-glow">
            <Icon size={40} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-3">{slide.title}</h1>
          <p className="text-tg-hint max-w-xs leading-relaxed">{slide.text}</p>
        </motion.div>
      </AnimatePresence>

      <Button fullWidth size="lg" onClick={next}>
        {step < slides.length - 1 ? (
          <>
            Далее <ChevronRight size={18} className="inline ml-1" />
          </>
        ) : (
          'Начать'
        )}
      </Button>
    </div>
  )
}
