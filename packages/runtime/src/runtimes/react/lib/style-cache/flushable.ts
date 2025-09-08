import { createStyleCache, type BaseStyleCache } from './base'

type FlushableStyleCache = BaseStyleCache & {
  /**
   * Flush the inserted styles.
   * @returns A list of class names and the corresponding CSS rules that were flushed.
   */
  flush: () => { classNames: string[]; css: string }
}

export const createFlushableStyleCache = ({ key }: { key?: string } = {}): FlushableStyleCache => {
  const cache = createStyleCache({ key })

  // additional state to track inserted style names
  let inserted: string[] = []

  return {
    ...cache,

    // override the `insert` method to track inserted names
    insert(...args) {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return cache.insert(...args)
    },

    flush() {
      const classNames = inserted
      // reset our own state, leave `cache.inserted` intact
      inserted = []

      return {
        classNames,
        css: classNames.reduce((css, name) => {
          return css + cache.inserted[name]
        }, ''),
      }
    },
  }
}
