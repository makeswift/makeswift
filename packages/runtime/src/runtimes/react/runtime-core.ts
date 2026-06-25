import { type SerializableReplacementContext } from '@makeswift/controls'

import { ApiResourcesClient } from '../../api/api-resources-client'
import { HostApiResourcesClient } from '../../api/host-api-resources-client'
import { MakeswiftApiResourcesClient } from '../../api/makeswift-api-resources-client'
import { type HttpFetch } from '../../api/types'
import { type SiteVersion } from '../../api/site-version'

import {
  type Breakpoints,
  type BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

import { copyElementTree } from '../../state/ops/copy-element-tree'

import { getBreakpoints, type Element, type ElementData } from '../../state/read-only-state'
import {
  configureProtoStore,
  configureReadWriteStore,
  type ProtoStore,
  type Store,
} from '../../state/store'

import { RefCountedMap } from '../../utils/ref-counted-map'
import { isServer } from '../../utils/is-server'

export type StoreKey = {
  siteVersion: SiteVersion | null
  locale: string | undefined
}

const VERSION_TAG_LIVE = 'ref:live'

export class RuntimeCore {
  // The unowned entry TTL affects performance, not correctness. The TTL controls how long an unretained store stays
  // in the map. If an entry expires and is removed from the map before React commits, the store remains retained
  // via `<StoreContext.Provider>`. The only impact is that future lookups will create a new store instance instead of
  // reusing the existing one, reducing cache efficiency.
  private readonly activeStores = new RefCountedMap<string | null, Store>({
    unownedEntryTtlMs: 1000,
    // Checking on retain/release is sufficient on the client, and we don't need to check on get on the server
    // as the only scenario in which we add the store to the map is when the runtime is already bound to the
    // requested site version, which should be the only site version for which the store is requested
    ttlCheck: RefCountedMap.TTLCheck.ON_RETAIN | RefCountedMap.TTLCheck.ON_RELEASE,
  })

  private readonly apiKey: string | undefined

  readonly protoStore: ProtoStore
  readonly appOrigin: string
  readonly apiOrigin: string
  readonly requestKey: StoreKey | undefined
  readonly fetch: HttpFetch

  constructor({
    appOrigin = 'https://app.makeswift.com',
    apiOrigin = 'https://api.makeswift.com',
    apiKey,
    breakpoints,
    requestKey,
    fetch,
  }: {
    appOrigin?: string
    apiOrigin?: string
    apiKey?: string
    breakpoints?: BreakpointsInput
    requestKey?: StoreKey
    fetch: HttpFetch
  }) {
    this.appOrigin = validateOrigin(appOrigin, 'appOrigin')
    this.apiOrigin = validateOrigin(apiOrigin, 'apiOrigin')
    this.apiKey = apiKey
    this.requestKey = requestKey
    this.fetch = fetch

    this.protoStore = configureProtoStore({
      name: 'Runtime proto-store',
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
    })
  }

  getOrCreateStore({ siteVersion, locale }: StoreKey): Store {
    const key = storeCacheKey({ siteVersion, locale })

    const createStore = () => {
      // API resources client includes an in-memory cache of the site's resources and thus also has to be versioned
      const apiResourcesClient = this.createApiResourcesClient({ siteVersion, locale })

      // TODO: we need to decouple editability from the site version; specifically, previewing
      // a draft version of the site should not lead to switching to the read-write state
      const isReadOnly = siteVersion == null

      return configureReadWriteStore({
        name: `Runtime read-write store (site version: ${key})`,
        appOrigin: this.appOrigin,
        apiResourcesClient,
        preloadedState: { ...this.protoStore.getState(), siteVersion, isReadOnly, locale },
      })
    }

    // On the server, stores are ephemeral by default so SSR does not retain them in a long-lived runtime.
    // The exception is a runtime that is already bound to the requested site version & locale, where we
    // can safely reuse the store across multiple root regions and benefit from the host API client's
    // in-memory cache.
    //
    // On the client, stores are reference-counted by site version so multiple root regions can share a store
    // instance, which preserves the pre-v0.17 per-site-version store behavior without requiring a separate
    // runtime per root.
    const usePersistentStore = this.shouldUsePersistentStore(key)
    return usePersistentStore ? this.activeStores.getOrCreate(key, createStore) : createStore()
  }

  retainStore({ siteVersion, locale }: StoreKey, store: Store): void {
    const key = storeCacheKey({ siteVersion, locale })

    if (!this.shouldUsePersistentStore(key)) {
      console.error('RuntimeCore: attempt to retain an ephemeral store', { key })
      return
    }

    if (this.activeStores.retain(key, store)) {
      store.startBreakpointWatch()
    }
  }

  releaseStore({ siteVersion, locale }: StoreKey, store: Store): void {
    const key = storeCacheKey({ siteVersion, locale })

    if (!this.shouldUsePersistentStore(key)) {
      console.error('RuntimeCore: attempt to release an ephemeral store', { key })
      return
    }

    if (this.activeStores.release(key, store)) {
      store.stopBreakpointWatch()
    }
  }

  copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.protoStore.getState(), elementTree, replacementContext)
  }

  getBreakpoints(): Breakpoints {
    return getBreakpoints(this.protoStore.getState())
  }

  get graphqlApiEndpoint(): string {
    return new URL('graphql', this.apiOrigin).href
  }

  private createApiResourcesClient(preloadedState: {
    siteVersion: SiteVersion | null
    locale: string | undefined
  }): ApiResourcesClient {
    if (isServer() && this.apiKey) {
      return new MakeswiftApiResourcesClient({
        fetch: this.fetch,
        apiKey: this.apiKey,
        apiOrigin: this.apiOrigin,
        graphqlApiEndpoint: this.graphqlApiEndpoint,
        preloadedState,
      })
    }

    return new HostApiResourcesClient({
      fetch: this.fetch,
      preloadedState,
    })
  }

  private shouldUsePersistentStore(key: string): boolean {
    // don't persist stores on the server unless the runtime instance is bound to a request
    // and the requested store matches the request's site version and locale
    return !isServer() || (this.requestKey !== undefined && storeCacheKey(this.requestKey) === key)
  }
}

const storeCacheKey = ({ siteVersion, locale }: StoreKey): string =>
  `${siteVersionTag(siteVersion)}/${locale ?? 'default'}`

const siteVersionTag = (siteVersion: SiteVersion | null): string =>
  siteVersion?.version ?? VERSION_TAG_LIVE

function validateOrigin(url: string, name: string): string {
  try {
    return new URL(url).origin
  } catch {
    throw new Error(`The Makeswift runtime received an invalid \`${name}\` parameter: "${url}".`)
  }
}
