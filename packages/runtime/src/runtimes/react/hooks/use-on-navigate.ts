'use client'

import { useRef, useEffect, useCallback } from 'react'

const CLICK_NAVIGATION_THRESHOLD_MS = 100

type ClickEvent = {
  href: string
  target: string
  timestamp: number
}

export type PageNavigationEvent = { url: string | null; external: boolean }

export const useOnNavigate = (callback: (args: PageNavigationEvent) => void) => {
  const previousLocation = useRef<string | null>(null) // initialize with null to always trigger the callback on first run
  const lastClickEvent = useRef<ClickEvent | null>(null)

  const handleNavigate = useCallback(
    async (destinationUrl: string | null) => {
      if (destinationUrl === previousLocation.current) return

      const origin = getOrigin(previousLocation.current)
      callback({
        url: destinationUrl,
        external: origin !== null && getOrigin(destinationUrl) !== origin,
      })

      previousLocation.current = destinationUrl
    },
    [callback],
  )

  useEffect(() => {
    // trigger navigation callback on initial page load
    handleNavigate(windowLocation())
  }, [handleNavigate])

  if (typeof window === 'undefined') {
    return
  }

  const unsubscribes: (() => void)[] = []

  // check for availability of the experimental Navigation API, see
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
  if ('navigation' in window && window.navigation) {
    const navigation = window.navigation

    const handler = ({ destination }: NavigateEvent) => handleNavigate(destination?.url ?? null)
    navigation.addEventListener('navigate', handler)
    unsubscribes.push(() => navigation.removeEventListener('navigate', handler))

    return () => {
      unsubscribes.forEach(u => u())
    }
  }

  // for browsers lacking Navigation API support, we manually track:
  //  - link clicks to capture destination URLs
  //  - page unload events to detect cross-page navigation
  //
  // TODO: also listen for form submissions
  const clickHandler = (e: MouseEvent) => {
    const a =
      e.composedPath?.().find(n => n instanceof HTMLAnchorElement) ??
      (e.target instanceof Element && e.target.closest?.('a'))

    if (!a) return

    lastClickEvent.current = { href: a.href, target: a.target, timestamp: Date.now() }
  }

  window.document.addEventListener(
    'click',
    clickHandler,
    { capture: true }, // run before bubbling to fortify against `stopPropagation()` calls
  )

  unsubscribes.push(() =>
    window.document.removeEventListener('click', clickHandler, { capture: true }),
  )

  const unloadHandler = () => {
    if (!lastClickEvent.current) return

    const msSinceLastClick = Date.now() - lastClickEvent.current.timestamp
    handleNavigate(
      msSinceLastClick < CLICK_NAVIGATION_THRESHOLD_MS ? lastClickEvent.current.href ?? null : null,
    )
  }

  window.addEventListener('beforeunload', unloadHandler)
  unsubscribes.push(() => window.removeEventListener('beforeunload', unloadHandler))

  return () => {
    unsubscribes.forEach(u => u())
  }
}

const windowLocation = (): string | null =>
  typeof window !== 'undefined' ? window.location.href : null

const getOrigin = (url: string | null) => {
  if (!url) return null

  try {
    return new URL(url).origin
  } catch {
    console.warn('Failed to extract origin from', url)
    return null
  }
}
