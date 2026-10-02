import { type KeyboardEvent, type ReactNode } from 'react'
import { type Descendant, Editor, Element, Range, Text, Transforms } from 'slate'
import { type RenderElementProps, type RenderLeafProps } from 'slate-react'
import isHotkey from 'is-hotkey'
import { v4 as uuid } from 'uuid'

import { Slate } from '@makeswift/controls'

import { type RichTextV2Plugin } from '../../controls/rich-text-v2/plugin'
import { RichTextV2Definition, type RichTextDataV2 } from '../../controls/rich-text-v2'
import { unstable_TextFormat } from '../../controls/text-format'
import { unstable_UrlLink } from '../../controls/link'
import { normalizeInlineMode } from '../InlineModePlugin'
import { TypographyPlugin } from '../TypographyPlugin'
import { LinkPlugin } from '../LinkPlugin'

import {
  htmlToNodes,
  isRawHtml,
  leafMarks,
  nodesToHtml,
  rawHtmlElement,
  STRIKETHROUGH,
  UNDERLINE,
} from './html'

export { htmlToNodes, nodesToHtml, rawHtmlElement, isRawHtml } from './html'

/**
 * Edits Page Builder HTML in a RichText value.
 *
 * - An unedited value is one `raw-html` element that holds the Page Builder
 *   HTML. It renders as it is, and `toHtml` writes it as it is.
 * - The first selection in the editor turns it into editable nodes.
 * - A phrasing host (for example an `<h2>`) gets the inline mode rules: one
 *   block, no `<p>`, and Enter writes nothing.
 *
 * Put this plugin last: it has no control, and it renders the elements itself
 * without the renderers of the plugins before it.
 */
export function PageBuilderHtmlPlugin({ phrasing }: PageBuilderHtmlOptions): RichTextV2Plugin {
  return {
    withPlugin: editor => withPageBuilderHtml(editor, { phrasing }),
    onKeyDown: (event, editor) => onKeyDown(event, editor, phrasing),
    renderElement: () => props => <PageBuilderElement {...props} />,
  }
}

export type PageBuilderHtmlOptions = {
  /** The host element accepts phrasing content only, for example an `<h2>`. */
  phrasing: boolean
}

/**
 * The Page Builder toolbar: bold, italic, underline, strikethrough, and URL
 * links. The formats use the typography data, so the typography plugin logic
 * reads and writes them. The typography entry renders the leaves with the tags
 * that TinyMCE writes, so the widget CSS styles the text in the same way before
 * and after a save.
 *
 * The plugin order is the same for each `phrasing` value, because the builder
 * finds a plugin control by its index.
 */
export function pageBuilderHtmlPlugins(
  { phrasing }: PageBuilderHtmlOptions = { phrasing: false },
): RichTextV2Plugin[] {
  const typography = TypographyPlugin()
  const link = LinkPlugin()

  return [
    {
      ...typography,
      control: typography.control && {
        ...typography.control,
        definition: unstable_TextFormat(),
        // The leaf renderer reads the marks from the leaf.
        getLeafValue: undefined,
      },
      renderLeaf: () => props => <PageBuilderLeaf {...props} />,
    },
    {
      ...link,
      control: link.control && { ...link.control, definition: unstable_UrlLink({ label: 'Link' }) },
    },
    PageBuilderHtmlPlugin({ phrasing }),
  ]
}

/** The HTML for the widget template. */
export function toHtml(data: RichTextDataV2 | undefined): string {
  if (data == null) return ''

  return nodesToHtml(RichTextV2Definition.dataToNodes(data) as Descendant[])
}

/** RichText data that holds Page Builder HTML as it is, for the migration. */
export function fromHtml(html: string): RichTextDataV2 {
  return RichTextV2Definition.nodesToDataV2([rawHtmlElement(html)] as any, uuid())
}

export function withPageBuilderHtml(editor: Editor, { phrasing }: PageBuilderHtmlOptions): Editor {
  const { apply, isVoid, normalizeNode } = editor

  editor.isVoid = element => isRawHtml(element) || isVoid(element)

  editor.normalizeNode = entry => {
    if (isRawHtml(entry[0])) return
    if (phrasing && normalizeInlineMode(editor, entry)) return

    normalizeNode(entry)
  }

  // The first selection means that the merchant starts to edit. Turn the raw
  // HTML into editable nodes without operations, so nothing saves until a real
  // edit, as in Page Builder. The old selection points into the raw element,
  // so select the whole text, as the builder does when it enters content mode.
  editor.apply = operation => {
    if (
      operation.type === 'set_selection' &&
      operation.newProperties != null &&
      editor.children.some(isRawHtml)
    ) {
      editor.children = expandRawHtml(editor.children, phrasing)
      editor.selection = null
      Transforms.select(editor, { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) })
      return
    }

    apply(operation)
  }

  return editor
}

/**
 * The value with each raw HTML element replaced by the editable nodes of its
 * HTML. The editor starts with this value in content mode, so every text that
 * a selection can point to is rendered.
 */
export function expandRawHtmlData(
  data: RichTextDataV2 | undefined,
  { phrasing }: PageBuilderHtmlOptions,
): RichTextDataV2 | undefined {
  if (data == null) return data

  const nodes = RichTextV2Definition.dataToNodes(data) as Descendant[]
  if (!nodes.some(isRawHtml)) return data

  return RichTextV2Definition.nodesToDataV2(
    expandRawHtml(nodes, phrasing) as any,
    'key' in data ? data.key : undefined,
  )
}

/** Replaces each raw HTML element with the editable nodes of its HTML. */
function expandRawHtml(children: Descendant[], phrasing: boolean): Descendant[] {
  const nodes = children.flatMap(node =>
    isRawHtml(node) ? htmlToNodes(node.html, { phrasing }) : [node],
  )

  // The inline mode has one block.
  return phrasing && nodes.length > 1 ? htmlToNodes(nodesToHtml(nodes), { phrasing }) : nodes
}

function onKeyDown(event: KeyboardEvent, editor: Editor, phrasing: boolean) {
  // The Page Builder (TinyMCE) shortcuts.
  const mark = isHotkey('mod+b', event)
    ? 'fontWeight'
    : isHotkey('mod+i', event)
      ? 'italic'
      : isHotkey('mod+u', event)
        ? 'underline'
        : null

  if (mark != null) {
    event.preventDefault()
    toggleMark(editor, mark)
    return
  }

  if (phrasing && isHotkey('shift+enter', event)) {
    event.preventDefault()
    Editor.insertText(editor, '\n')
    return
  }

  if (phrasing && isHotkey('enter', event)) event.preventDefault()
}

type Mark = 'fontWeight' | 'italic' | 'underline'

const ON_VALUE: Record<Mark, number | boolean> = { fontWeight: 700, italic: true, underline: true }

const BASE_DEVICE_ID = 'desktop'

/**
 * Sets or clears one format on the selected text, in the base breakpoint
 * typography. This is what the builder format bar does too.
 */
function toggleMark(editor: Editor, mark: Mark) {
  const { selection } = editor
  if (selection == null || Range.isCollapsed(selection)) return

  const isOn = (leaf: Text) => {
    const marks = leafMarks(leaf)
    return mark === 'fontWeight' ? marks.bold : marks[mark]
  }

  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, {}, { match: Text.isText, split: true })

    const leaves = [...Editor.nodes<Text>(editor, { match: Text.isText })]
    const active = leaves.every(([leaf]) => isOn(leaf))

    leaves.forEach(([leaf, path]) => {
      const typography: any = (leaf as any).typography ?? { style: [] }
      const style: any[] = typography.style ?? []
      const base = style.find(item => item?.deviceId === BASE_DEVICE_ID) ?? {
        deviceId: BASE_DEVICE_ID,
        value: {},
      }
      const { [mark]: _previous, ...rest } = base.value ?? {}
      const value = active ? rest : { ...rest, [mark]: ON_VALUE[mark] }

      Transforms.setNodes(
        editor,
        {
          typography: {
            ...typography,
            style: [
              ...style.filter(item => item?.deviceId !== BASE_DEVICE_ID),
              { deviceId: BASE_DEVICE_ID, value },
            ],
          },
        } as any,
        { at: path },
      )
    })
  })
}

// ------ Rendering ------

const CONTENTS = { display: 'contents' } as const

// The editor root has `white-space: pre-wrap`. Unedited HTML has source line
// breaks and indentation, and the widget shows them as white space.
const RAW_HTML_STYLE = { display: 'contents', whiteSpace: 'normal' } as const

function PageBuilderElement({ attributes, children, element }: RenderElementProps): ReactNode {
  const node = element as any

  if (isRawHtml(node)) {
    // A void element: Slate needs `children` for its spacer.
    return (
      <span {...attributes} style={CONTENTS}>
        <span
          contentEditable={false}
          style={RAW_HTML_STYLE}
          dangerouslySetInnerHTML={{ __html: node.html }}
        />
        {children}
      </span>
    )
  }

  if (node.type === Slate.InlineType.Link) {
    return (
      <a {...attributes} href={node.link?.payload?.url}>
        {children}
      </a>
    )
  }

  if (Element.isElement(node) && node.type === Slate.BlockType.Paragraph) {
    const align = Array.isArray(node.textAlign)
      ? (node.textAlign.find((item: any) => item?.deviceId === BASE_DEVICE_ID) ?? node.textAlign[0])
          ?.value
      : undefined

    return (
      <p {...attributes} style={align == null ? undefined : { textAlign: align }}>
        {children}
      </p>
    )
  }

  return <span {...attributes}>{children}</span>
}

/**
 * The mark tags as TinyMCE writes them, with the Slate leaf attributes on the
 * outermost tag, so there is no extra wrapper around them.
 */
function PageBuilderLeaf({ attributes, children, leaf }: RenderLeafProps): ReactNode {
  const marks = leafMarks(leaf)
  const tags: Array<(content: ReactNode, props?: object) => ReactNode> = []

  if (marks.bold) tags.push((content, props) => <strong {...props}>{content}</strong>)
  if (marks.italic) tags.push((content, props) => <em {...props}>{content}</em>)
  if (marks.underline) {
    tags.push((content, props) => (
      <span {...props} style={cssText(UNDERLINE)}>
        {content}
      </span>
    ))
  }
  if (marks.strikethrough) {
    tags.push((content, props) => (
      <span {...props} style={cssText(STRIKETHROUGH)}>
        {content}
      </span>
    ))
  }

  if (tags.length === 0) return <span {...attributes}>{children}</span>

  return tags.reduce<ReactNode>(
    (content, tag, index) => tag(content, index === tags.length - 1 ? attributes : undefined),
    children,
  )
}

/** `text-decoration: underline;` as a React style object. */
function cssText(declaration: string) {
  const [property = '', value = ''] = declaration.replace(/;$/, '').split(':')

  return { [property.trim().replace(/-(\w)/g, (_, c: string) => c.toUpperCase())]: value.trim() }
}
