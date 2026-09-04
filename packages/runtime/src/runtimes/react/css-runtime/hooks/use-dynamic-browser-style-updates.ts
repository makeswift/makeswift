import { useEffect } from 'react'
import { StylesRegistry } from '../styles-registry'
import { BrowserDynamicStylesBridge } from '../browser-dynamic-styles-bridge'
import { StyleElementUpdater } from '../style-element-updater'
import { type BrowserStyleApplier } from '../types'

export function useDynamicBrowserStyleUpdates(registry: StylesRegistry) {
  useEffect(() => {
    const applier: BrowserStyleApplier = new StyleElementUpdater()
    const bridge = new BrowserDynamicStylesBridge(registry, applier)

    return () => {
      bridge.dispose()
      applier.dispose?.()
    }
  }, [registry])
}
