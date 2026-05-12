import { type HostNavigationEvent } from './api'

type ClickEvent = {
  href: string
  timestamp: number
}

const CLICK_NAVIGATION_THRESHOLD_MS = 100
const CLICK_NAVIGATION_CHECK_INTERVAL_MS = 200
const CLICK_NAVIGATION_MAX_CHECKS = 20

export function setupNavigationListener(
  callback: (args: HostNavigationEvent) => void,
): VoidFunction {
  let previousLocation: string | null = null

  const handleNavigate = (event: HostNavigationEvent) => {
    if (!event.navigationCompleted && event.url === previousLocation) return

    callback(event)
    previousLocation = event.url
  }

  // trigger navigation callback on initial page load
  handleNavigate({ url: windowLocation(), navigationCompleted: 'initial-page-load' })

  if (typeof window === 'undefined') {
    return () => {}
  }

  const unsubscribes: (() => void)[] = []

  // check for availability of the Navigation API (baseline feature since January 2026),
  // see https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
  if ('navigation' in window && window.navigation) {
    const navigation = window.navigation

    const navigateHandler = ({ destination }: NavigateEvent) =>
      handleNavigate({ url: destination.url })

    const navigateSuccessHandler = () => {
      handleNavigate({
        url: navigation.currentEntry.url,
        navigationCompleted: 'client-side-navigation',
      })
    }

    // note that in order to capture destination URLs that might not be Makeswift-enabled,
    // we send a `SiteNavigationEvent` at the start of navigation, but do not track whether
    // the navigation was successful or not (possible future improvement)
    navigation.addEventListener('navigate', navigateHandler)
    navigation.addEventListener('navigatesuccess', navigateSuccessHandler)
    unsubscribes.push(() => navigation.removeEventListener('navigate', navigateHandler))
    unsubscribes.push(() =>
      navigation.removeEventListener('navigatesuccess', navigateSuccessHandler),
    )

    return () => {
      unsubscribes.forEach(u => u())
    }
  }

  // for browsers lacking Navigation API support, we manually track:
  //  - link clicks to capture destination URLs
  //  - page unload events to detect cross-page navigation
  //
  // this works well enough to keep this polyfill in place for now, but not nearly as
  // reliably as the Navigation API
  let lastClickEvent: ClickEvent | null = null

  const clickHandler = (e: MouseEvent) => {
    const a =
      e.composedPath?.()?.find(n => n instanceof HTMLAnchorElement) ??
      (e.target instanceof Element && e.target.closest?.('a'))

    if (!a) return

    lastClickEvent = { href: a.href, timestamp: Date.now() }

    const pageUrlBeforeClick = windowLocation()
    let navigationCheckCounter = 0

    // handle navigation between pages in the host; note that we intentionally are
    // not cancelling the timer on cleanup to ensure we report the navigation
    const checkIfNavigationOccurred = () => {
      const url = windowLocation()

      if (url !== pageUrlBeforeClick) {
        // the host navigated to a different page, report the new URL to the builder
        handleNavigate({ url, polyfilled: true })
        return
      }

      // we're still on the same page, recheck until the max number of checks is reached
      if (++navigationCheckCounter < CLICK_NAVIGATION_MAX_CHECKS) {
        window.setTimeout(checkIfNavigationOccurred, CLICK_NAVIGATION_CHECK_INTERVAL_MS)
      }
    }

    window.setTimeout(checkIfNavigationOccurred, CLICK_NAVIGATION_CHECK_INTERVAL_MS)
  }

  window.document.addEventListener(
    'click',
    clickHandler,
    { capture: true }, // run before bubbling to fortify against `stopPropagation()` calls
  )

  unsubscribes.push(() =>
    window.document.removeEventListener('click', clickHandler, { capture: true }),
  )

  // handle external navigation
  const unloadHandler = () => {
    if (!lastClickEvent) return

    const msSinceLastClick = Date.now() - lastClickEvent.timestamp
    handleNavigate({
      url: msSinceLastClick < CLICK_NAVIGATION_THRESHOLD_MS ? (lastClickEvent.href ?? null) : null,
      polyfilled: true,
    })

    lastClickEvent = null
  }

  window.addEventListener('beforeunload', unloadHandler)
  unsubscribes.push(() => window.removeEventListener('beforeunload', unloadHandler))

  return () => {
    unsubscribes.forEach(u => u())
  }
}

const windowLocation = (): string | null =>
  typeof window !== 'undefined' ? window.location.href : null
