import { useStyle } from '../use-style'

/**
 * `slate-react` renders read-only rich-text within a `<p>` tag containing
 * multiple spans. Makeswift text-styles are applied to these spans via a class
 * on the span tags directly:
 *
 * <p class="...">
 *    <span class="mswft-12345">My text</span>
 * </p>
 *
 * HOWEVER: in the builder, `slate-react` renders the same content as editable
 * text with additional DOM structure; namely, intermediate nested spans (with
 * data attributes like `data-slate-string`, `data-slate-zero-width`) between
 * the `<span>` that carries Makeswift's typography class and the text content:
 *
 * <p data-slate-node="element" class="...">
 *    <span data-slate-node="text">
 *        <span class="mswft-12345" data-slate-leaf="true">
 *            <span data-slate-string="true">My text</span>
 *        </span>
 *    </span>
 * </p>
 *
 * If the host contains CSS that matches spans directly (ex: a global `span {
 * color: ... }` rule), the host CSS applies to the innermost spans and beats
 * the Makeswift text styles in terms of specificity. Therefore, setting text
 * styles won't work in the builder: the top-level host styles will win. On the
 * live page, the Makeswift styles win since the intermediate DOM elements are
 * not present.
 *
 * These style updates address this by reverting base styles on these spans,
 * restoring inheritance from Makeswift defined styles, thus matching the live
 * page where the text is a direct child of the classed leaf span.
 */
export function useSlateReset(): string {
  return useStyle({
    // @ts-expect-error: csstype's `all` doesn't accept `!important` annotations
    '& [data-slate-string], & [data-slate-zero-width]': {
      all: 'revert !important',
    },
  })
}
