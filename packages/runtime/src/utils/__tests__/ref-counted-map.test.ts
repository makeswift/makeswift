import { RefCountedMap } from '../ref-counted-map'

interface Cat {
  name: string
}

describe('RefCountedMap', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('entries are unowned by default', () => {
    const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })

    const whiskers = map.getOrCreate('whiskers', () => ({ name: 'Whiskers' }))

    expect(whiskers).toEqual({ name: 'Whiskers' })
    expect(map.size).toBe(1)

    jest.advanceTimersByTime(101)

    // 'whiskers' entry should be evicted after TTL expiration
    const mittens = map.getOrCreate('mittens', () => ({ name: 'Mittens' }))

    expect(mittens).toEqual({ name: 'Mittens' })
    expect(map.size).toBe(1)
    expect(map.get('whiskers')).toBeUndefined()
  })

  it("unowned entry's TTL is refreshed when it is accessed again", () => {
    const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
    const key = 'whiskers'
    const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))

    jest.advanceTimersByTime(101)

    // no new entry should be created
    const whiskers2 = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
    expect(whiskers2).toBe(whiskers)

    // whiskers entry should still be in the map
    expect(map.size).toBe(1)
    expect(map.get('whiskers')).toBe(whiskers)
  })

  it('retained entries are not affected by TTL expiration, are properly reference-counted', () => {
    const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
    const key = 'whiskers'

    const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
    expect(map.retain(key, whiskers)).toBe(true)

    jest.advanceTimersByTime(101)

    // 'whiskers' entry should NOT be evicted
    const mittens = map.getOrCreate('mittens', () => ({ name: 'Mittens' }))
    expect(mittens).toEqual({ name: 'Mittens' })
    expect(map.get(key)).toBe(whiskers)
    expect(map.size).toBe(2)

    // returns the existing instance of 'whiskers' entry
    const whiskers2 = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
    expect(map.retain(key, whiskers)).toBe(false)
    expect(whiskers2).toBe(whiskers)

    // 'whiskers' should still be in the map
    expect(map.release(key, whiskers)).toBe(false)
    expect(map.get(key)).toBe(whiskers)
    expect(map.size).toBe(2)

    // this should remove 'whiskers' from the map
    expect(map.release(key, whiskers)).toBe(true)
    expect(map.get(key)).toBeUndefined()
    expect(map.size).toBe(1)
  })

  it('calling `retain` on an evicted entry adds it back to the map', () => {
    const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
    const key = 'whiskers'

    const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
    expect(map.get(key)).toBe(whiskers)
    expect(map.size).toBe(1)

    jest.advanceTimersByTime(101)

    // trigger 'whiskers' entry eviction
    map.getOrCreate('mittens', () => ({ name: 'Mittens' }))
    expect(map.get(key)).toBeUndefined()

    expect(map.retain(key, whiskers)).toBe(true)

    // 'whiskers' entry should be added back to the map
    expect(map.get(key)).toBe(whiskers)
    expect(map.size).toBe(2)

    // ... and cleaned up properly on release
    expect(map.release(key, whiskers)).toBe(true)
    expect(map.get(key)).toBeUndefined()
    expect(map.size).toBe(1)
  })

  it('`retain` calls for a different value tracked under the same key are ignored', () => {
    const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
    const key = 'whiskers'

    const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))

    jest.advanceTimersByTime(101)

    // trigger 'whiskers' entry eviction
    map.getOrCreate('mittens', () => ({ name: 'Mittens' }))
    expect(map.get(key)).toBeUndefined()

    const otherWhiskers = map.getOrCreate(key, () => ({ name: 'Other Whiskers' }))
    expect(map.get(key)).toBe(otherWhiskers)

    // should have no effect
    expect(map.retain(key, whiskers)).toBe(false)

    jest.advanceTimersByTime(101)
    // should have no effect, trigger 'otherWhiskers' eviction
    expect(map.retain(key, whiskers)).toBe(false)
    expect(map.get(key)).toBeUndefined()
    expect(map.size).toBe(0)
  })

  describe('`release` calls', () => {
    it('for an evicted entry are ignored', () => {
      const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
      const key = 'whiskers'

      const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
      expect(map.get(key)).toBe(whiskers)
      expect(map.size).toBe(1)

      jest.advanceTimersByTime(101)
      // trigger 'whiskers' entry eviction
      map.getOrCreate('mittens', () => ({ name: 'Mittens' }))
      expect(map.get(key)).toBeUndefined()

      // should have no effect
      expect(map.release(key, whiskers)).toBe(false)
      expect(map.get(key)).toBeUndefined()
      expect(map.size).toBe(1)
    })

    it('for an unowned entry are ignored', () => {
      const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
      const key = 'whiskers'

      const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
      expect(map.get(key)).toBe(whiskers)
      expect(map.size).toBe(1)

      // should have no effect
      expect(map.release(key, whiskers)).toBe(false)
      expect(map.get(key)).toBe(whiskers)
      expect(map.size).toBe(1)
    })

    it('for a different value tracked under the same key are ignored', () => {
      const map = new RefCountedMap<string, Cat>({ unownedEntryTtlMs: 100 })
      const key = 'whiskers'

      const whiskers = map.getOrCreate(key, () => ({ name: 'Whiskers' }))
      expect(map.get(key)).toBe(whiskers)

      jest.advanceTimersByTime(101)

      // trigger 'whiskers' entry eviction
      map.getOrCreate('mittens', () => ({ name: 'Mittens' }))
      expect(map.get(key)).toBeUndefined()

      const otherWhiskers = map.getOrCreate(key, () => ({ name: 'Other Whiskers' }))
      expect(map.get(key)).toBe(otherWhiskers)

      // should have no effect
      expect(map.release(key, whiskers)).toBe(false)
      expect(map.get(key)).toBe(otherWhiskers)
    })
  })
})
