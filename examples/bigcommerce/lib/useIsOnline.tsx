import { useSyncExternalStore } from 'react'

function getSnapshot() {
  return navigator.onLine
}

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getServerSnapshot() {
  return true
}

export function useIsOnline() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return isOnline
}
