import { type Descendant, type Text } from 'slate'

import { Slate } from '@makeswift/controls'

/**
 * Converts between Page Builder HTML and the Slate nodes of
 * a RichText value.
 *
 * - A `raw-html` element holds HTML that nobody edited yet, for example the
 *   value that the migration copied from Page Builder. `nodesToHtml` writes it
 *   as it is, so an unedited value keeps the Page Builder HTML exactly.
 * - The editor turns a `raw-html` element into editable nodes with
 *   `htmlToNodes` at the first edit.
 * - For all other nodes, `nodesToHtml` is the only writer, so it is also the
 *   sanitizer: it writes only the tags below, escaped text, and safe links.
 *
 * | Format        | Slate                            | HTML                    |
 * |---------------|----------------------------------|-------------------------|
 * | Bold          | typography `fontWeight` >= 600   | `<strong>`              |
 * | Italic        | typography `italic`              | `<em>`                  |
 * | Underline     | typography `underline`           | `<u>`                   |
 * | Strikethrough | typography `strikethrough`       | `<s>`                   |
 * | Link          | `link` inline                    | `<a href>`              |
 * | Alignment     | block `textAlign`                | `style="text-align: …"` |
 * | Line break    | `\n` in the text                 | `<br>`                  |
 *
 * A `paragraph` block becomes `<p>`. A `default` block (inline mode, for a
 * phrasing host like `<h2>`) has no `<p>`, and a line break separates two of
 * them.
 */

export const RAW_HTML = 'raw-html'

export type RawHtmlElement = { type: typeof RAW_HTML; html: string; children: [{ text: '' }] }

export function rawHtmlElement(html: string): RawHtmlElement {
  return { type: RAW_HTML, html, children: [{ text: '' }] }
}

export function isRawHtml(node: unknown): node is RawHtmlElement {
  return (node as any)?.type === RAW_HTML && typeof (node as any).html === 'string'
}

export type Marks = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
}

type Run = { text: string; marks: Marks; href: string | null; newTab: boolean }

type Block = { align: string | null; runs: Run[] }

const BASE_DEVICE_ID = 'desktop'

const BLOCK_TAGS = new Set([
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'li',
  'address',
])

const TEXT_ALIGNS = new Set(['left', 'center', 'right', 'justify'])

/** The TinyMCE 5 `underline` and `strikethrough` formats. */
export const UNDERLINE = 'text-decoration: underline;'
export const STRIKETHROUGH = 'text-decoration: line-through;'

const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#|\.|\?)/i

// ------ HTML to Slate ------

export function htmlToNodes(html: string, { phrasing }: { phrasing: boolean }): Descendant[] {
  const document = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const blocks: Block[] = []
  let current: Block | null = null

  const block = (align: string | null): Block => {
    current = { align, runs: [] }
    blocks.push(current)
    return current
  }

  const walk = (node: Node, marks: Marks, link: Pick<Run, 'href' | 'newTab'>) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = collapse(node.textContent ?? '')
      if (text === '' || (current == null && text.trim() === '')) return
      ;(current ?? block(null)).runs.push({ text, marks, ...link })
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return

    const element = node as HTMLElement
    const tag = element.tagName.toLowerCase()

    if (tag === 'br') {
      ;(current ?? block(null)).runs.push({ text: '\n', marks, ...link })
      return
    }

    const style = element.style
    const weight = style.fontWeight
    const decoration = `${style.textDecoration} ${style.textDecorationLine}`
    const next: Marks = {
      bold:
        marks.bold || tag === 'strong' || tag === 'b' || weight === 'bold' || Number(weight) >= 600,
      italic: marks.italic || tag === 'em' || tag === 'i' || style.fontStyle === 'italic',
      underline: marks.underline || tag === 'u' || decoration.includes('underline'),
      strikethrough:
        marks.strikethrough ||
        tag === 's' ||
        tag === 'strike' ||
        tag === 'del' ||
        decoration.includes('line-through'),
    }
    const nextLink =
      tag === 'a'
        ? {
            href: element.getAttribute('href'),
            newTab: element.getAttribute('target') === '_blank',
          }
        : link

    if (BLOCK_TAGS.has(tag)) {
      const align = TEXT_ALIGNS.has(style.textAlign) ? style.textAlign : null
      block(align)
      element.childNodes.forEach(child => walk(child, next, nextLink))
      current = null
      return
    }

    element.childNodes.forEach(child => walk(child, next, nextLink))
  }

  document.body.childNodes.forEach(child => walk(child, {}, { href: null, newTab: false }))

  const result = phrasing ? [mergeBlocks(blocks)] : blocks

  return result.length === 0 ? [emptyBlock()] : result.map(block => toSlateBlock(block, phrasing))
}

/** Inline mode has one block. A block boundary becomes a line break. */
function mergeBlocks(blocks: Block[]): Block {
  return {
    align: null,
    runs: blocks.flatMap((block, index) =>
      index === 0
        ? block.runs
        : [{ text: '\n', marks: {}, href: null, newTab: false }, ...block.runs],
    ),
  }
}

function emptyBlock(): Descendant {
  return { type: Slate.BlockType.Default, children: [{ text: '' }] } as Descendant
}

function toSlateBlock(block: Block, phrasing: boolean): Descendant {
  const children: Array<Text | Descendant> = []

  block.runs.forEach(run => {
    const leaf = toLeaf(run)
    const last = children.at(-1) as any

    if (run.href == null) {
      children.push(leaf)
    } else if (last?.type === Slate.InlineType.Link && last.link?.payload?.url === run.href) {
      last.children.push(leaf)
    } else {
      children.push({
        type: Slate.InlineType.Link,
        link: { type: 'OPEN_URL', payload: { url: run.href, openInNewTab: run.newTab } },
        children: [leaf],
      } as Descendant)
    }
  })

  // Slate needs a text node at each end of an inline.
  if (children.length === 0 || !('text' in (children.at(-1) as object))) children.push({ text: '' })
  if (!('text' in (children[0] as object))) children.unshift({ text: '' })

  return {
    type: phrasing ? Slate.BlockType.Default : Slate.BlockType.Paragraph,
    ...(block.align == null
      ? {}
      : { textAlign: [{ deviceId: BASE_DEVICE_ID, value: block.align }] }),
    children,
  } as Descendant
}

function toLeaf({ text, marks }: Run): Text {
  const value: Record<string, unknown> = {}
  if (marks.bold) value.fontWeight = 700
  if (marks.italic) value.italic = true
  if (marks.underline) value.underline = true
  if (marks.strikethrough) value.strikethrough = true

  return Object.keys(value).length === 0
    ? { text }
    : ({ text, typography: { style: [{ deviceId: BASE_DEVICE_ID, value }] } } as Text)
}

/** Like the browser: runs of white space are one space. */
function collapse(text: string): string {
  return text.replace(/[ \t\n\r]+/g, ' ')
}

// ------ Slate to HTML ------

export function nodesToHtml(nodes: Descendant[]): string {
  let previousInline = false

  return nodes
    .map(node => {
      if (isRawHtml(node)) {
        previousInline = false
        return node.html
      }

      if ((node as any).type === Slate.BlockType.Paragraph) {
        previousInline = false
        const align = responsiveValue((node as any).textAlign)
        const style =
          typeof align === 'string' && TEXT_ALIGNS.has(align) ? ` style="text-align: ${align}"` : ''
        return `<p${style}>${childrenHtml(node)}</p>`
      }

      const html = `${previousInline ? '<br>' : ''}${childrenHtml(node)}`
      previousInline = true
      return html
    })
    .join('')
}

function childrenHtml(node: Descendant): string {
  const children = (node as any).children
  if (!Array.isArray(children)) return ''

  return children
    .map((child: any) => {
      if (typeof child.text === 'string') return leafHtml(child)
      if (child.type === Slate.InlineType.Link) return linkHtml(child)
      return childrenHtml(child)
    })
    .join('')
}

function linkHtml(link: any): string {
  const href = linkHref(link.link)
  const content = childrenHtml(link)
  if (href == null) return content

  const target = link.link?.payload?.openInNewTab === true ? ' target="_blank"' : ''
  return `<a href="${escape(href)}"${target}>${content}</a>`
}

/**
 * Only URL links: the builder shows no other link types for this control.
 * Email and phone links from older data are kept.
 */
function linkHref(data: any): string | null {
  const payload = data?.payload ?? {}
  const href =
    data?.type === 'OPEN_URL'
      ? payload.url
      : data?.type === 'SEND_EMAIL'
        ? `mailto:${payload.to ?? ''}`
        : data?.type === 'CALL_PHONE'
          ? `tel:${payload.phoneNumber ?? ''}`
          : null

  return typeof href === 'string' && SAFE_HREF.test(href.trim()) ? href.trim() : null
}

export function leafMarks(leaf: any): Marks {
  const value = responsiveValue(leaf.typography?.style) ?? {}

  return {
    bold: Number(value.fontWeight) >= 600,
    italic: value.italic === true,
    underline: value.underline === true,
    strikethrough: value.strikethrough === true,
  }
}

function leafHtml(leaf: Text): string {
  const marks = leafMarks(leaf)
  let html = escape(leaf.text).replace(/\n/g, '<br>')

  if (html === '') return ''
  if (marks.bold) html = `<strong>${html}</strong>`
  if (marks.italic) html = `<em>${html}</em>`
  if (marks.underline) html = `<span style="${UNDERLINE}">${html}</span>`
  if (marks.strikethrough) html = `<span style="${STRIKETHROUGH}">${html}</span>`

  return html
}

/** The base breakpoint value. Other breakpoints are not written. */
function responsiveValue(values: unknown): any {
  if (!Array.isArray(values)) return undefined

  return (values.find(item => item?.deviceId === BASE_DEVICE_ID) ?? values[0])?.value
}

function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\u00a0/g, '&nbsp;')
}
