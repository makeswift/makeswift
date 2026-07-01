import { CSSObject, serializeStyles as emotionSerializeStyles } from "@emotion/serialize";
import { serialize, compile, stringify, prefixer, middleware } from 'stylis'
import { murmur3 } from 'murmurhash-js'
import { BoxDisplayModel, Breakpoints, ResolvedStyle, Stylesheet } from "@makeswift/controls";
import { resolvedStyleToCss } from "../lib/resolved-style-to-css";
import { DEFAULT_CSS_CLASS_NAME_PREFIX } from "./constants";

export function serializeStyles(styles: Array<CSSObject>): { content: string, contentHash: string} {
  const emotionSerializationResult = emotionSerializeStyles(styles)
  return {
    content: emotionSerializationResult.styles,
    contentHash: emotionSerializationResult.name,
  }
}

function compileCss({ content, className }: { content: string, className: string }): string {
  const cssElementTree = compile(`.${className} { ${content}}`)
  return serialize(cssElementTree, middleware([prefixer, stringify]))
}

export function toCss(stylesObject: CSSObject, className: string): { css: string, contentHash: string } {
  const { content, contentHash } = serializeStyles([stylesObject])
  const css = compileCss({ content, className })
  return { css, contentHash }
}

export function generateClassName({ data, classNamePrefix }: { data: string, classNamePrefix?: string }): string {
  const prefix = classNamePrefix ?? DEFAULT_CSS_CLASS_NAME_PREFIX
  return `${prefix}-${murmur3(data).toString(36)}`
}

type OnCssGenerated = ({
  className,
  css,
  contentHash,
  elementKey,
  joinedPropPath,
  onBoxModelChange,
}: {
  className: string,
  css: string,
  contentHash: string,
  elementKey: string,
  joinedPropPath: string,
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}) => void

export class StylesheetEngine implements Stylesheet {
  constructor(
    private breakpointsData: Breakpoints,
    private elementKey: string,
    private propPathComponents: readonly string[] = [],
    private onCssGenerated: OnCssGenerated,
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
    this.onCssGenerated?.({
      className,
      css,
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
      this.onCssGenerated
    )
  }
}
