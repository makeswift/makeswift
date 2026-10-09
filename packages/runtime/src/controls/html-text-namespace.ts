/**
 * A text control whose value is an HTML string. In the builder, `Text` edits
 * the HTML in an element of the host page. See `controls/html-text`.
 */
export {
  type HtmlTextFormat as Format,
  type HtmlTextFormats as Formats,
  type HtmlTextLink as Link,
} from './html-text'
export { HtmlText as Text } from '../runtimes/react/controls/html-text/html-text'
