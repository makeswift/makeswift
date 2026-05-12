type RefCountedMapEntry<V> = {
  value: V
  count: number
}

type UnownedMapEntry<V> = {
  value: V
  count: undefined
  accessedAt: number
}

type MapEntry<V> = RefCountedMapEntry<V> | UnownedMapEntry<V>

const TTLCheck = {
  ON_GET: 1 << 0,
  ON_RETAIN: 1 << 1,
  ON_RELEASE: 1 << 2,
} as const

/**
 * Ref-counted map with explicit retention semantics. Entries are unowned by default and may be evicted after their
 * TTL unless explicitly retained. This provides TTL-based caching for unowned entries, while allowing consumers to
 * opt into stronger lifetime control via explicit retention.
 */
export class RefCountedMap<K, V> {
  private readonly map = new Map<K, MapEntry<V>>()
  private readonly unownedEntryTtlMs: number
  private readonly ttlCheck: number

  static readonly TTLCheck = TTLCheck

  constructor({
    unownedEntryTtlMs,
    ttlCheck = TTLCheck.ON_GET | TTLCheck.ON_RETAIN | TTLCheck.ON_RELEASE,
  }: {
    unownedEntryTtlMs: number
    ttlCheck?: number
  }) {
    this.unownedEntryTtlMs = unownedEntryTtlMs
    this.ttlCheck = ttlCheck
  }

  get size(): number {
    return this.map.size
  }

  get(key: K): V | undefined {
    return this.map.get(key)?.value
  }

  getOrCreate(key: K, init: () => V): V {
    try {
      const existing = this.map.get(key)

      if (existing) {
        if (isUnowned(existing)) existing.accessedAt = Date.now()
        return existing.value
      }

      const value = init()
      this.map.set(key, { value, count: undefined, accessedAt: Date.now() })
      return value
    } finally {
      if (this.ttlCheck & TTLCheck.ON_GET) this.removeExpired()
    }
  }

  retain(key: K, value: V): void {
    try {
      const existing = this.map.get(key)

      // `retain` might be called on a unowned entry that has already been evicted from the map due to TTL expiration
      // *and* possibly replaced by a new unowned entry with the same key; handle this gracefully
      if (existing != null) {
        if (existing.value !== value) return
        existing.count = (existing.count ?? 0) + 1
      } else {
        this.map.set(key, { value, count: 1 })
      }
    } finally {
      if (this.ttlCheck & TTLCheck.ON_RETAIN) this.removeExpired()
    }
  }

  release(key: K, value: V): void {
    try {
      const existing = this.map.get(key)

      // `release` might be called on an entry that remained unowned due being superseded by a new entry with the same
      // key after TTL expiration of the original entry; handle this gracefully
      if (existing == null) return
      if (isUnowned(existing)) return
      if (existing.value !== value) return

      if (existing.count > 1) {
        existing.count -= 1
      } else {
        this.map.delete(key)
      }
    } finally {
      if (this.ttlCheck & TTLCheck.ON_RELEASE) this.removeExpired()
    }
  }

  private removeExpired(): void {
    const now = Date.now()
    const isExpired = (entry: MapEntry<V>): boolean =>
      isUnowned(entry) && now - entry.accessedAt > this.unownedEntryTtlMs

    this.map.forEach((entry, key) => {
      if (isExpired(entry)) this.map.delete(key)
    })
  }
}

const isUnowned = <V>(entry: MapEntry<V>): entry is UnownedMapEntry<V> => entry.count === undefined
