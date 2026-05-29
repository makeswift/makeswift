import { useEffect } from "react";
import { StylesRegistry } from "../styles-registry";
import { BrowserDynamicStylesBridge } from "../browser-dynamic-styles-bridge";
import { AdoptedStylesheetApplier } from "../adopted-stylesheet-applier";

export function useDynamicBrowserStyleUpdates(registry: StylesRegistry) {
  useEffect(() => {
    const applier = new AdoptedStylesheetApplier()
    const bridge = new BrowserDynamicStylesBridge(registry, applier)

    return () => {
      bridge.dispose()
      applier.dispose?.()
    }
  }, [registry])
}
