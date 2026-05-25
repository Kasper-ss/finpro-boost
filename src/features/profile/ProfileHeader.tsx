import { User } from 'lucide-react'
import { useAppStore } from '@/app/store'

export function ProfileHeader() {
  const user = useAppStore((s) => s.user)
  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      {user.photoUrl ? (
        <img src={user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <User size={20} className="text-accent" />
        </div>
      )}
      <div>
        <p className="font-medium">
          {user.firstName} {user.lastName ?? ''}
        </p>
        {user.username && <p className="text-xs text-tg-hint">@{user.username}</p>}
      </div>
    </div>
  )
}
