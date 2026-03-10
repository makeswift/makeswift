export type HostNavigationEvent = {
  url: string | null
  navigationCompleted?: 'initial-page-load' | 'client-side-navigation'
  // indicates whether the navigation event was captured via the Navigation API or
  // via our polyfill for browsers lacking Navigation API support
  polyfilled?: boolean
}

export type BuilderApi = {
  handleHostNavigate(event: HostNavigationEvent): void
}
