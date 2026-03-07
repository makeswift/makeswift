export type HostNavigationEvent = {
  url: string | null
  initialPageLoad: boolean
}

export type BuilderApi = {
  handleHostNavigate(event: HostNavigationEvent): void
}
