export type SiteNavigationEvent = {
  url: string | null
  initialPageLoad: boolean
}

type ClickEvent = {
  href: string
  timestamp: number
}

const CLICK_NAVIGATION_THRESHOLD_MS = 100
const LOCATION_CHECK_DELAY_MS = 700 // give the host generous time to perform the navigation

export function setupNavigationListener(
  callback: (args: SiteNavigationEvent) => void,
): VoidFunction {
  let previousLocation: string | null = null

  const handleNavigate = (event: SiteNavigationEvent) => {
    if (event.url === previousLocation) return

    callback(event)
    previousLocation = event.url
  }

  // trigger navigation callback on initial page load
  handleNavigate({ url: windowLocation(), initialPageLoad: true })

  if (typeof window === 'undefined') {
    return () => {}
  }

  const unsubscribes: (() => void)[] = []

  // check for availability of the Navigation API (baseline feature since January 2026),
  // see https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
  if ('navigation' in window && window.navigation) {
    const navigation = window.navigation

    const handler = ({ destination }: NavigateEvent) =>
      handleNavigate({ url: destination.url, initialPageLoad: false })

    // note that in order to capture destination URLs that might not be Makeswift-enabled,
    // we send a `SiteNavigationEvent` at the start of navigation, but do not track whether
    // the navigation was successful or not (possible future improvement)
    navigation.addEventListener('navigate', handler)
    unsubscribes.push(() => navigation.removeEventListener('navigate', handler))

    return () => {
      unsubscribes.forEach(u => u())
    }
  }

  // for browsers lacking Navigation API support, we manually track:
  //  - link clicks to capture destination URLs
  //  - page unload events to detect cross-page navigation
  let lastClickEvent: ClickEvent | null = null

  const clickHandler = (e: MouseEvent) => {
    const a =
      e.composedPath?.()?.find(n => n instanceof HTMLAnchorElement) ??
      (e.target instanceof Element && e.target.closest?.('a'))

    if (!a) return

    lastClickEvent = { href: a.href, timestamp: Date.now() }

    // handle navigation between pages in the host; note that we intentionally are
    // not cancelling the timer on cleanup to ensure we report the navigation
    window.setTimeout(
      () => handleNavigate({ url: windowLocation(), initialPageLoad: false }),
      LOCATION_CHECK_DELAY_MS,
    )
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
      initialPageLoad: false,
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
