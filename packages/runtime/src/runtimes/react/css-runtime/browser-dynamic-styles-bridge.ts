import { CSSObject } from "@emotion/serialize";
import { toRevertObject } from "./utils";
import { ControlledStyleData , BrowserStyleApplier } from "./types";
import { StylesRegistry } from "./styles-registry";
import { toCss } from "./serialize-css";

/**
 * Handles runtime style changes to "controlled" (Makeswift-editable) style data by mediating
 * between the Makeswift styles registry and a mechanism for applying dynamic style updates
 * to the browser.
 * 
 * Assumes the following invariant:
 * The initial css (prior to any runtime edits) emitted during prop resolution is always included
 * somewhere in Document stylesheets. For example, by being included somewhere in the document as
 * a `<style>` tag. (Note: whether the `<style>` tag was hoisted or not is irrelevant).
 */
export class BrowserDynamicStylesBridge {
  private unsubscribe: () => void

  private initialCssObjects: Map<string, CSSObject>

  /*
    Keyed by class name.

    Lazily calculated upon the first runtime style edit.
  */
  private cssReverts: Map<string, string>

  constructor(
    registry: StylesRegistry,
    private applier: BrowserStyleApplier
  ) {
    this.initialCssObjects = new Map()
    this.cssReverts = new Map()
    this.unsubscribe = registry.subscribeToControlledStyleWrites(({ className, data }) => {
      this.handleWrite({ className, data })
    })
  }

  private handleWrite({ className, data }: { className: string, data: ControlledStyleData }) {
    const initialCssObject = this.initialCssObjects.get(className)

    if (initialCssObject == null) {
      this.initialCssObjects.set(className, data.cssObject)

      // Don't calculate a revert until the first runtime edit
      return
    }

    let cssRevert = this.cssReverts.get(className)
    if (cssRevert == null) {
      const cssRevertObject: CSSObject = toRevertObject(initialCssObject)
      const { css } = toCss(cssRevertObject, className)
      cssRevert = css
      this.cssReverts.set(className, cssRevert)
    }

    const updatedCss = `${cssRevert}\n${data.css}`

    this.applier.apply({ className, css: updatedCss })
  }

  dispose(): void {
    this.unsubscribe()
  }
}