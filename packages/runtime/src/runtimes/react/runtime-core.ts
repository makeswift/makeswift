import { type SerializableReplacementContext } from '@makeswift/controls'

import { MakeswiftHostApiClient } from '../../api/client'
import * as MakeswiftApiClient from '../../state/makeswift-api-client'
import { type SiteVersion } from '../../api/site-version'

import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

import { copyElementTree } from '../../state/ops/copy-element-tree'

import { getBreakpoints, type Element, type ElementData } from '../../state/read-only-state'
import { configureStore, type Store } from '../../state/store'
import { setLocale } from '../../builder'
import {
  resetLocaleState,
  setIsReadOnly,
  setSiteVersion,
} from '../../state/actions/internal/read-only-actions'

export class RuntimeCore {
  readonly store: Store
  readonly hostApiClient: MakeswiftHostApiClient
  readonly appOrigin: string
  readonly apiOrigin: string

  constructor({
    appOrigin = 'https://app.makeswift.com',
    apiOrigin = 'https://api.makeswift.com',
    breakpoints,
    fetch,
  }: {
    appOrigin?: string
    apiOrigin?: string
    breakpoints?: BreakpointsInput
    fetch: MakeswiftApiClient.HttpFetch
  }) {
    this.appOrigin = validateOrigin(appOrigin, 'appOrigin')
    this.apiOrigin = validateOrigin(apiOrigin, 'apiOrigin')

    this.hostApiClient = new MakeswiftHostApiClient({
      uri: new URL('graphql', this.apiOrigin).href,
      fetch: fetch,
    })

    this.store = configureStore({
      name: 'Runtime store',
      hostApiClient: this.hostApiClient,
      appOrigin: this.appOrigin,
      preloadedState: null,
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
    })
  }

  setIdempotent({
    siteVersion,
    isReadOnly,
    locale,
  }: {
    siteVersion: SiteVersion | null
    isReadOnly: boolean
    locale: string | undefined
  }): void {
    this.store.dispatch(setSiteVersion(siteVersion))
    this.store.dispatch(setIsReadOnly(isReadOnly))
    this.store.dispatch(locale != null ? setLocale(new Intl.Locale(locale)) : resetLocaleState())
  }

  async setupStore({ isReadOnly }: { isReadOnly: boolean }): Promise<() => void> {
    const unloadReadWriteState = await this.store.loadReadWriteState({ isReadOnly })
    return () => unloadReadWriteState()
  }

  copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.store.getState(), elementTree, replacementContext)
  }

  getBreakpoints(): Breakpoints {
    return getBreakpoints(this.store.getState())
  }
}

function validateOrigin(url: string, name: string): string {
  try {
    return new URL(url).origin
  } catch {
    throw new Error(`The Makeswift runtime received an invalid \`${name}\` parameter: "${url}".`)
  }
}
