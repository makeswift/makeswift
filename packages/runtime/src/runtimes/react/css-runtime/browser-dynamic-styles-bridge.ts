import { ControlledStyleData, BrowserStyleApplier } from './types'
import { StylesRegistry } from './styles-registry'

/**
 * Handles runtime style changes to "controlled" (Makeswift-editable) style data by mediating
 * between the Makeswift styles registry and a mechanism for applying dynamic style updates
 * to the browser.
 */
export class BrowserDynamicStylesBridge {
  private unsubscribe: () => void
  private isDisposed: boolean
  private applier: BrowserStyleApplier

  constructor(registry: StylesRegistry, applier: BrowserStyleApplier) {
    this.isDisposed = false
    this.applier = applier
    this.unsubscribe = registry.subscribeToControlledStyleWrites(
      ({ className, currentData, initialData }) => {
        this.handleWrite({ className, currentData, initialData })
      },
    )
  }

  private handleWrite({
    className,
    currentData,
    initialData,
  }: {
    className: string
    currentData: ControlledStyleData
    initialData: ControlledStyleData
  }) {
    if (currentData === initialData || this.isDisposed) return
    this.applier.apply({ className, css: currentData.css })
  }

  dispose(): void {
    this.isDisposed = true
    this.unsubscribe()
  }
}
