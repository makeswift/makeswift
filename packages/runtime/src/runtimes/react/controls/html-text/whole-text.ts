import {
  type HtmlTextFormat,
  type HtmlTextFormats,
  type HtmlTextLink,
  type HtmlTextPanelEditor,
  anchorLink,
  htmlTextFormats,
} from '../../../../controls/html-text'

/** The tag that a format writes, and the tags that hold the format. */
const FORMAT_TAGS: Record<HtmlTextFormat, { tag: string; selector: string }> = {
  bold: { tag: 'strong', selector: 'strong, b' },
  italic: { tag: 'em', selector: 'em, i' },
  underline: { tag: 'u', selector: 'u' },
  strikethrough: { tag: 's', selector: 's, strike, del' },
}

function parse(html: string): HTMLElement {
  const root = document.createElement('div')

  root.innerHTML = html

  return root
}

/** The text nodes that are not only white space. */
function textNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text

    if (node.data.trim() !== '') nodes.push(node)
  }

  return nodes
}

function closestIn(node: Node, selector: string, root: HTMLElement): HTMLElement | null {
  const element = node.parentElement?.closest<HTMLElement>(selector) ?? null

  return element != null && root.contains(element) ? element : null
}

function unwrapAll(root: HTMLElement, selector: string): void {
  root.querySelectorAll(selector).forEach(element => element.replaceWith(...element.childNodes))
}

function wrapText(root: HTMLElement, createWrapper: () => HTMLElement): void {
  textNodes(root).forEach(node => {
    const wrapper = createWrapper()

    node.replaceWith(wrapper)
    wrapper.appendChild(node)
  })
}

export function wholeTextFormats(html: string): HtmlTextFormats {
  const root = parse(html)
  const nodes = textNodes(root)
  const hasFormat = (format: HtmlTextFormat) =>
    nodes.length > 0 && nodes.every(node => closestIn(node, FORMAT_TAGS[format].selector, root))

  // The text has a link only if all of it is in links to the same place.
  const anchors = nodes.map(node => closestIn(node, 'a[href]', root) as HTMLAnchorElement | null)
  const first = anchors.at(0)
  const link =
    first != null &&
    anchors.every(anchor => anchor?.getAttribute('href') === first.getAttribute('href'))
      ? anchorLink(first)
      : null

  return htmlTextFormats(hasFormat, link)
}

export function setWholeTextFormat(html: string, format: HtmlTextFormat, on: boolean): string {
  const root = parse(html)
  const { tag, selector } = FORMAT_TAGS[format]

  unwrapAll(root, selector)
  if (on) wrapText(root, () => document.createElement(tag))

  return root.innerHTML
}

export function setWholeTextLink(html: string, link: HtmlTextLink | null): string {
  const root = parse(html)

  unwrapAll(root, 'a')

  if (link != null) {
    wrapText(root, () => {
      const anchor = document.createElement('a')

      anchor.setAttribute('href', link.href)

      if (link.openInNewTab) {
        anchor.target = '_blank'
        anchor.rel = 'noopener'
      }

      return anchor
    })
  }

  return root.innerHTML
}

/**
 * An editor for the whole text, without a selection. The panel uses it in
 * build mode, as for a Makeswift RichText: a format applies to all the text.
 */
export function wholeTextEditor(
  html: () => string,
  onChange: (html: string) => void,
): HtmlTextPanelEditor {
  return {
    formats: () => wholeTextFormats(html()),
    setFormat: (format, on) => onChange(setWholeTextFormat(html(), format, on)),
    setLink: link => onChange(setWholeTextLink(html(), link)),
  }
}
