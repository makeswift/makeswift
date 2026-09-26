import { CSSObject, serializeStyles as emotionSerializeStyles } from '@emotion/serialize'
import {
  DECLARATION,
  KEYFRAMES,
  RULESET,
  serialize,
  compile,
  stringify,
  prefixer,
  middleware,
  type Element as StylisElement,
  type Middleware,
} from 'stylis'

type SerializationOptions = {
  forceImportant?: boolean
}

/**
 * Creates a css string from the styles object and provided class name.
 *
 * The output of this function is the "final" css that is intended to be used directly
 * as `<style>` content, constructible stylesheet content, etc.
 *
 * For "controlled" styles, this represents the last step in the conversion of:
 *    Makeswift prop data -> JS styles object -> css string
 *
 * For "uncontrolled" styles, this is used to convert an inline JS styles object
 * into a css string.
 */
export function toCssStatements(
  stylesObject: CSSObject,
  className: string,
  { forceImportant = false }: SerializationOptions = {},
): { css: string; contentHash: string } {
  const { content: rawCssContent, contentHash } = toRawCss([stylesObject], { forceImportant })
  const classNameRawCss = `.${className} {${rawCssContent}}`
  const css = processCss({ content: classNameRawCss, forceImportant })
  return { css, contentHash }
}

/**
 * This is a layer in the css pipeline that uses a css preprocessor
 * to apply select transformations to "raw" css input.
 *
 * Converts the inputted css content into an abstract syntax tree for manipulation
 * (performing unnesting, applying vendor prefixes, etc.). Re-serializes and returns
 * the transformed css string.
 */
export function processCss({
  content,
  forceImportant = false,
}: { content: string } & SerializationOptions): string {
  const cssElementTree = compile(content)
  return serialize(
    cssElementTree,
    middleware([...(forceImportant ? [appendImportant] : []), prefixer, stringify]),
  )
}

const appendImportant: Middleware = element => {
  // Skip non-declarative elements and declarations that don't belong to a ruleset (e.g. `@font-face`)
  if (element.type !== DECLARATION || element.root?.type !== RULESET) return

  // Skip declarations within keyframes, which don't support `!important`
  for (
    let ancestor: StylisElement | null = element.parent;
    ancestor != null;
    ancestor = ancestor.parent
  ) {
    if (ancestor.type === KEYFRAMES) return
  }

  // Don't append if it's already present
  if (/!important\s*;$/i.test(element.value)) return

  element.value = element.value.replace(/;$/, '!important;')
}

/**
 * Uses Emotion's `serializeStyles` function to create a css string
 * which is returned along with a content hash.
 *
 * The resulting css content is "raw" in the sense that it hasn't been passed
 * through our css preprocessing layer.
 */
export function toRawCss(
  styles: Array<CSSObject>,
  { forceImportant }: SerializationOptions,
): { content: string; contentHash: string } {
  const { styles: serializedStyles, name } = emotionSerializeStyles(styles)
  return {
    content: serializedStyles,
    contentHash: forceImportant ? `${name}-important` : name,
  }
}
