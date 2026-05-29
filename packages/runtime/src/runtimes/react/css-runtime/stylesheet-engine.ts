import { BoxDisplayModel, Breakpoints, ResolvedStyle, Stylesheet } from "@makeswift/controls"
import { generateClassName } from "./utils"
import { StylesheetDefinedStyleData } from "./types"
import { resolvedStyleToCss } from "../lib/resolved-style-to-css"
import { toCss } from "./serialize-css"

export class StylesheetEngine implements Stylesheet {
  constructor(
    private breakpointsData: Breakpoints,
    private elementKey: string,
    private propPathComponents: readonly string[] = [],
    private onDefineStyle: (data: StylesheetDefinedStyleData) => void,
    private classNamePrefix?: string
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(
    resolvedStyle: ResolvedStyle,
    onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
  ): string {
    const joinedPropPath = this.propPathComponents.join('.')
    const className = generateClassName({
      data: `${this.elementKey}-${joinedPropPath}`,
      classNamePrefix: this.classNamePrefix
    })
    const cssObject = resolvedStyleToCss(this.breakpointsData, resolvedStyle)
    const { css, contentHash } = toCss(cssObject, className)

    this.onDefineStyle?.({
      className,
      css,
      cssObject,
      contentHash,
      elementKey: this.elementKey,
      joinedPropPath,
      onBoxModelChange
    })
    return className
  }

  child(propName: string): Stylesheet {
    return new StylesheetEngine(
      this.breakpointsData,
      this.elementKey,
      [...this.propPathComponents, propName],
      this.onDefineStyle,
      this.classNamePrefix
    )
  }

  key(): string {
    return `${this.elementKey}:${this.propPathComponents.join('.')}`
  }
}
