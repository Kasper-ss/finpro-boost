import { BottomNav } from './BottomNav'
import { useAppStore } from '@/app/store'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: React.ReactNode }) {
  const activeTab = useAppStore((s) => s.activeTab)
  const isChat = activeTab === 'ai'

  return (
    <div className="h-full flex flex-col bg-surface">
      <main
        className={cn(
          'flex-1 min-h-0 pb-20',
          isChat ? 'flex flex-col overflow-hidden' : 'scroll-area'
        )}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
