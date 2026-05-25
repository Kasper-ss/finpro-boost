import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, Bot } from 'lucide-react'
import { useAppStore } from '@/app/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  QUICK_QUESTIONS,
  generateAdvisorResponse,
} from '@/features/ai-advisor/advisorLogic'
import { formatRelative } from '@/lib/utils'
import { haptic } from '@/lib/telegram'

function renderMarkdownLite(text: string) {
  return text.split('\n').map((line, i) => (
    <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">
      {line.split('**').map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
    </p>
  ))
}

export function AIAdvisorPage() {
  const chatMessages = useAppStore((s) => s.chatMessages)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    haptic('light')
    addChatMessage('user', text)
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = generateAdvisorResponse(text, useAppStore.getState())
      addChatMessage('assistant', reply)
      setTyping(false)
      haptic('success')
    }, 800 + Math.random() * 600)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-accent/20">
            <Sparkles className="text-accent" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold">ИИ Советник</h1>
            <p className="text-xs text-tg-hint">Анализ на основе ваших данных</p>
          </div>
        </div>
      </div>

      <div className="flex-1 scroll-area p-4 space-y-3">
        {chatMessages.length === 0 && (
          <Card className="text-center text-tg-hint text-sm py-6">
            <Bot size={32} className="mx-auto mb-2 opacity-50" />
            Задайте вопрос или выберите быстрый вариант ниже
          </Card>
        )}

        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-accent text-accent-text'
                  : 'bg-surface-card border border-white/10'
              }`}
            >
              {msg.role === 'assistant' ? renderMarkdownLite(msg.content) : msg.content}
              <p className="text-[10px] opacity-60 mt-1">{formatRelative(msg.timestamp)}</p>
            </div>
          </motion.div>
        ))}

        {typing && (
          <div className="flex gap-1 px-4 py-3 rounded-2xl bg-surface-card w-fit">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-tg-hint"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 space-y-3 safe-bottom bg-surface-card/95">
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-left"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ваш вопрос..."
            className="flex-1 rounded-xl bg-surface-elevated border border-white/10 px-4 py-3 text-sm"
          />
          <Button onClick={() => sendMessage(input)} className="!px-3">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
