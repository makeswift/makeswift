import { CSSObject } from '@emotion/serialize'
import { toRevertObject } from './utils'
import { ControlledStyleData, BrowserStyleApplier } from './types'
import { StylesRegistry } from './styles-registry'
import { toCssStatements } from './serialize-css'

/**
 * Handles runtime style changes to "controlled" (Makeswift-editable) style data by mediating
 * between the Makeswift styles registry and a mechanism for applying dynamic style updates
 * to the browser.
 *
 * Assumes the following:
 * The initial css (prior to any runtime edits) emitted during prop resolution is always included
 * somewhere in Document stylesheets. For example, by being included somewhere in the document as
 * a `<style>` tag. (Note: whether the `<style>` tag was hoisted or not is irrelevant).
 */
export class BrowserDynamicStylesBridge {
  private unsubscribe: () => void
  private isDisposed: boolean

  /*
    Keyed by class name.

    Lazily calculated upon the first runtime style update.
  */
  private cssReverts: Map<string, string>

  constructor(
    registry: StylesRegistry,
    private applier: BrowserStyleApplier,
  ) {
    this.isDisposed = false
    this.cssReverts = new Map()
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
    let cssRevert = this.cssReverts.get(className)
    if (cssRevert == null) {
      const cssRevertObject: CSSObject = toRevertObject(initialData.cssObject)
      const { css } = toCssStatements(cssRevertObject, className)
      cssRevert = css
      this.cssReverts.set(className, cssRevert)
    }
    const updatedCss = `${cssRevert}\n${currentData.css}`
    this.applier.apply({ className, css: updatedCss })
  }

  dispose(): void {
    this.isDisposed = true
    this.unsubscribe()
  }
}
