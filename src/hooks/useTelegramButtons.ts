import { useEffect } from 'react'
import { showMainButton, hideMainButton, showBackButton, hideBackButton } from '@/lib/telegram'

export function useMainButton(
  visible: boolean,
  text: string,
  onClick: () => void
) {
  useEffect(() => {
    if (!visible) {
      hideMainButton()
      return
    }
    showMainButton(text, onClick)
    return () => hideMainButton()
  }, [visible, text, onClick])
}

export function useBackButton(visible: boolean, onClick: () => void) {
  useEffect(() => {
    if (!visible) {
      hideBackButton()
      return
    }
    showBackButton(onClick)
    return () => hideBackButton()
  }, [visible, onClick])
}
