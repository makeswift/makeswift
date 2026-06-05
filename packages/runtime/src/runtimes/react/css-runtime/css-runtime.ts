import { CSSObject, serializeStyles } from "@emotion/serialize";
import { serialize, compile, stringify, prefixer, middleware } from 'stylis'
import { murmur3 } from 'murmurhash-js'
import { BoxDisplayModel, Breakpoints, ResolvedStyle, Stylesheet } from "@makeswift/controls";
import { resolvedStyleToCss } from "../lib/resolved-style-to-css";

/**
 * Converts a styles object into a string which is fit for use as input to a css preprocessor.
 * @param stylesObject
 */
function toIntermediateString(stylesObject: CSSObject): string {
  const emotionSerializationResult = serializeStyles([stylesObject])
  return emotionSerializationResult.styles
}

export function toCss(stylesObject: CSSObject, className: string): string {
  const intermediateCss = toIntermediateString(stylesObject)
  const cssElementTree = compile(`.${className} { ${intermediateCss}}`)
  const css = serialize(cssElementTree, middleware([prefixer, stringify]))
  return css
}

export function generateClassName(elementKey?: string, propPath?: string): string {
  return `ms-${murmur3(`${elementKey}-${propPath}`).toString(36)}`
}

type OnCssGenerated = ({
  className,
  css,
  elementKey,
  joinedPropPath,
  onBoxModelChange,
}: {
  className: string,
  css: string,
  elementKey: string,
  joinedPropPath: string,
  onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
}) => void

export class StylesheetEngine implements Stylesheet {
  constructor(
    private breakpointsData: Breakpoints,
    private elementKey: string,
    private propPathComponents: readonly string[] = [],
    private onCssGenerated?: OnCssGenerated
  ) {}

  breakpoints(): Breakpoints {
    return this.breakpointsData
  }

  defineStyle(
    resolvedStyle: ResolvedStyle,
    onBoxModelChange?: (boxModel: BoxDisplayModel | null) => void
  ): string {
    const joinedPropPath = this.propPathComponents.join('.')
    const className = generateClassName(this.elementKey, joinedPropPath)
    const cssObject = resolvedStyleToCss(this.breakpointsData, resolvedStyle)
    const css = toCss(cssObject, className)
    this.onCssGenerated?.({
      className,
      css,
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
      [...this.propPathComponents,propName],
      this.onCssGenerated
    )
  }
}
