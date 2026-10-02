/**
 * RichText values that edit Page Builder HTML. See
 * `slate/PageBuilderHtmlPlugin`.
 */
import { type RichTextV2Definition } from './rich-text-v2'
import { PageBuilderTextDefinition } from './rich-text-v2/page-builder'
import { pageBuilderHtmlPlugins } from '../slate/PageBuilderHtmlPlugin'

export { toHtml, fromHtml } from '../slate/PageBuilderHtmlPlugin'
export {
  PageBuilderText as Text,
  type PageBuilderTextHost as TextHost,
  type PageBuilderTextValue as TextValue,
} from '../runtimes/react/controls/rich-text-v2/page-builder/page-builder-text'

/** A RichText control with the Page Builder toolbar. Render its value with `Text`. */
export function RichText(
  config: ConstructorParameters<typeof RichTextV2Definition>[0],
): PageBuilderTextDefinition {
  return new PageBuilderTextDefinition(config, pageBuilderHtmlPlugins())
}
