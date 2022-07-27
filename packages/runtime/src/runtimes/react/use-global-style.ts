import * as React from 'react'
import { useRef } from 'react'
import { cache, injectGlobal } from '@emotion/css'
import { CSSInterpolation, serializeStyles } from '@emotion/serialize'
import { StyleSheet } from '@emotion/sheet'
import { insertStyles } from '@emotion/utils'

const isServer = typeof window === 'undefined'
const useInsertionEffectSpecifier = 'useInsertionEffect'
const useInsertionEffect = React[useInsertionEffectSpecifier] ?? React.useLayoutEffect

export function useGlobalStyle(...args: CSSInterpolation[]): void {
  if (isServer) return injectGlobal(args)

  const serialized = serializeStyles(args, cache.registered)
  const sheetRef = useRef<[StyleSheet, boolean]>()

  // Hydration
  useInsertionEffect(() => {
    const key = `${cache.key}-global`

    const cacheSheet = cache.sheet as StyleSheet
    const sheet = new (cacheSheet.constructor as typeof StyleSheet)({
      key,
      nonce: cacheSheet.nonce,
      container: cacheSheet.container,
      speedy: cacheSheet.isSpeedy,
    })

    const node = document.querySelector<HTMLStyleElement>(
      `style[data-emotion="${key} ${serialized.name}"]`,
    )

    if (cache.sheet.tags.length > 0) {
      sheet.before = cache.sheet.tags[0]
    }

    let rehydrating = false

    if (node != null) {
      rehydrating = true
      node.setAttribute('data-emotion', key)
      sheet.hydrate([node])
    }

    sheetRef.current = [sheet, rehydrating]

    return () => {
      sheet.flush()
    }
  })

  // Insertion
  useInsertionEffect(() => {
    const [sheet, rehydrating] = sheetRef.current ?? []

    if (sheet == null || rehydrating == null) return

    if (rehydrating) {
      sheetRef.current = [sheet, false]

      return
    }

    if (serialized.next != null) {
      insertStyles(cache, serialized.next, true)
    }

    if (sheet.tags.length > 0) {
      const element = sheet.tags[sheet.tags.length - 1].nextElementSibling

      sheet.before = element

      sheet.flush()
    }

    cache.insert('', serialized, sheet, false)
  })
}
