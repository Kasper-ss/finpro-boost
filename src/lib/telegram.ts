import WebApp from '@twa-dev/sdk'

export function initTelegramApp(): void {
  WebApp.ready()
  WebApp.expand()
  WebApp.enableClosingConfirmation()
  applyThemeFromTelegram()
  WebApp.onEvent('themeChanged', applyThemeFromTelegram)
}

function applyThemeFromTelegram(): void {
  const p = WebApp.themeParams
  const root = document.documentElement

  const map: Record<string, string | undefined> = {
    '--tg-theme-bg-color': p.bg_color,
    '--tg-theme-text-color': p.text_color,
    '--tg-theme-hint-color': p.hint_color,
    '--tg-theme-link-color': p.link_color,
    '--tg-theme-button-color': p.button_color,
    '--tg-theme-button-text-color': p.button_text_color,
    '--tg-theme-secondary-bg-color': p.secondary_bg_color,
  }

  Object.entries(map).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value)
  })

  document.documentElement.classList.toggle('dark', WebApp.colorScheme === 'dark')
}

export function getTelegramUser() {
  const u = WebApp.initDataUnsafe?.user
  if (!u) return null
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    username: u.username,
    photoUrl: u.photo_url,
  }
}

export function showMainButton(text: string, onClick: () => void): void {
  WebApp.MainButton.setText(text)
  WebApp.MainButton.onClick(onClick)
  WebApp.MainButton.show()
}

export function hideMainButton(): void {
  WebApp.MainButton.offClick(() => {})
  WebApp.MainButton.hide()
}

export function showBackButton(onClick: () => void): void {
  WebApp.BackButton.onClick(onClick)
  WebApp.BackButton.show()
}

export function hideBackButton(): void {
  WebApp.BackButton.offClick(() => {})
  WebApp.BackButton.hide()
}

export function shareApp(text: string, url?: string): void {
  const shareUrl = url ?? window.location.href
  if (WebApp.openTelegramLink) {
    const link = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
    WebApp.openTelegramLink(link)
  } else {
    navigator.share?.({ title: 'FinPro Boost', text, url: shareUrl })
  }
}

export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' = 'light'): void {
  if (type === 'success') WebApp.HapticFeedback.notificationOccurred('success')
  else WebApp.HapticFeedback.impactOccurred(type)
}

export { WebApp }
