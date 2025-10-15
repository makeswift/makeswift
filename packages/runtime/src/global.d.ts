import '@emotion/jest'

declare global {
  const PACKAGE_VERSION: string

  // partial typings for the experimental Navigation API, see
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
  interface NavigateEvent extends Event {
    readonly navigationType: 'push' | 'reload' | 'replace' | 'traverse'
    readonly destination: {
      readonly id: string
      readonly index: number
      readonly key: string
      readonly sameDocument: boolean
      readonly url: string
    } | null

    readonly hashChange: boolean
    readonly userInitiated: boolean
  }

  interface Navigation {
    addEventListener(type: 'navigate', listener: (event: NavigateEvent) => void): void
    removeEventListener(type: 'navigate', listener: (event: NavigateEvent) => void): void
  }

  interface Window {
    navigation?: Navigation
  }
}

export {}
