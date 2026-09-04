import { BoxDisplayModel, Breakpoints, ResolvedStyle, Stylesheet } from '@makeswift/controls'
import { generateClassName } from './utils'
import { ControlledStyleData } from './types'
import { resolvedStyleToCss } from '../lib/resolved-style-to-css'
import { toCssStatements } from './serialize-css'

export class StylesheetEngine implements Stylesheet {
  private breakpointsData: Breakpoints
  private documentKey: string
  private elementKey: string
  private propPathComponents: readonly string[]
  private onDefineStyle: (data: ControlledStyleData) => void
  private classNamePrefix?: string

  constructor({
    breakpointsData,
    documentKey,
    elementKey,
    propPathComponents,
    onDefineStyle,
    classNamePrefix,
  }: {
    breakpointsData: Breakpoints
    documentKey: string
    elementKey: string
    propPathComponents: readonly string[]
    onDefineStyle: (data: ControlledStyleData) => void
    classNamePrefix?: string
  }) {
    this.breakpointsData = breakpointsData
    this.documentKey = documentKey
    this.elementKey = elementKey
    this.propPathComponents = propPathComponents
    this.onDefineStyle = onDefineStyle
    this.classNamePrefix = classNamePrefix
  }

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(
    resolvedStyle: ResolvedStyle,
    onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void,
  ): string {
    const joinedPropPath = this.propPathComponents.join('.')
    const className = generateClassName({
      data: `${this.documentKey}-${this.elementKey}-${joinedPropPath}`,
      classNamePrefix: this.classNamePrefix,
    })
    const cssObject = resolvedStyleToCss(this.breakpointsData, resolvedStyle)
    const { css, contentHash } = toCssStatements(cssObject, className)

    this.onDefineStyle?.({
      className,
      css,
      cssObject,
      contentHash,
      elementKey: this.elementKey,
      joinedPropPath,
      onBoxModelChange,
    })
    return className
  }

  child(propName: string): Stylesheet {
    return new StylesheetEngine({
      breakpointsData: this.breakpointsData,
      documentKey: this.documentKey,
      elementKey: this.elementKey,
      propPathComponents: [...this.propPathComponents, propName],
      onDefineStyle: this.onDefineStyle,
      classNamePrefix: this.classNamePrefix,
    })
  }

  key(): string {
    return `${this.documentKey}-${this.elementKey}:${this.propPathComponents.join('.')}`
  }
}
