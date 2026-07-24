import { CSSObject, serializeStyles as emotionSerializeStyles } from "@emotion/serialize";
import { serialize, compile, stringify, prefixer, middleware } from 'stylis'

/**
 * Creates a css string from the styles object and provided class name.
 * 
 * The output of this function is the "final" css that is intended to be used directly
 * as `<style>` content or as browser stylesheet content.
 * 
 * For "controlled" styles, this represents the last step in the conversion of:
 *    Makeswift prop data -> JS styles object -> css string
 * 
 * For "uncontrolled" styles, this is used to convert an inline JS styles object
 * into a css string.
 */
export function toCss(stylesObject: CSSObject, className: string): { css: string, contentHash: string } {
  const { content: rawCssContent, contentHash } = toRawCss([stylesObject])
  const classNameRawCss = `.${className} {${rawCssContent}}`
  const css = processCss({ content: classNameRawCss })
  return { css, contentHash }
}

/**
 * Uses a css preprocessor to transform a css string into a "final" version
 * that is intended to be used directly as `<style>` content or as browser stylesheet
 * content.
 * 
 * Converts the raw inputted css content (which is potentially nested) into an
 * abstract syntax tree, which is then manipulated (i.e., applying vendor prefixes
 * in middleware) and ultimately serialized into a flattened css string with extra
 * spaces removed.
 */
function processCss({ content }: { content: string }): string {
  const cssElementTree = compile(content)
  return serialize(cssElementTree, middleware([prefixer, stringify]))
}

/**
 * Uses Emotion's `serializeStyles` function to create an initial css string
 * which is returned along with a content hash.
 * 
 * The resulting css content is "raw" in the sense that it hasn't been passed
 * through our css preprocessing layer.
 */
export function toRawCss(styles: Array<CSSObject>): { content: string, contentHash: string} {
  const emotionSerializationResult = emotionSerializeStyles(styles)
  return {
    content: emotionSerializationResult.styles,
    contentHash: emotionSerializationResult.name,
  }
}
