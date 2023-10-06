import escapeHtml from 'escape-html'
import { BlockType, InlineType } from '../../slate/types'
import { Descendant, Editor, Element, Node, Text, Transforms, createEditor } from 'slate'
import { jsx } from 'slate-hyperscript'
import { parseFragment } from 'parse5'
import { ChildNode, DocumentFragment } from 'parse5/dist/tree-adapters/default'

import { RichTextV2ControlData, RichTextV2ControlDefinition, RichTextV2Mode } from './rich-text-v2'
import { RichTextV2Plugin } from './plugin'
import { InlineModePlugin } from '../../slate/InlineModePlugin'
import { BlockPlugin } from '../../slate/BlockPlugin'
import { TypographyPlugin } from '../../slate/TypographyPlugin'
import { TextAlignPlugin } from '../../slate/TextAlignPlugin'
import { InlinePlugin } from '../../slate/InlinePlugin'
import { MakeswiftEditor } from '../../slate/types'
import { ElementUtils } from '../../slate/utils/element'
import { TranslationDto } from '../../state/react-page'

function pathToString(path: number[]): string {
  return path.join(':')
}

function stringToPath(s: string): number[] {
  return s.split(':').map(a => parseInt(a))
}

function getDescendantTranslatableData(descendant: Descendant, path: number[]): TranslationDto {
  if (Text.isText(descendant)) {
    return {}
  }

  switch (descendant.type) {
    case BlockType.UnorderedList:
    case BlockType.OrderedList:
    case BlockType.ListItem:
      return descendant.children.reduce(
        (acc, d, j) => ({ ...acc, ...getDescendantTranslatableData(d, [...path, j]) }),
        {},
      )

    default:
      const text = getInlineOrTextTranslatableData(descendant)

      if (text == null) return {}

      return { [pathToString(path)]: text }
  }
}

function getInlineOrTextTranslatableData(
  descendant: Descendant,
  path: number[] = [],
): string | null {
  if (Text.isText(descendant)) {
    let string = escapeHtml(descendant.text)

    if (string === '') return null

    if (descendant.typography === undefined) return string

    return `<span key="${pathToString(path)}">${string}</span>`
  }

  const children = descendant.children
    .map((child: Descendant, i: number) => getInlineOrTextTranslatableData(child, [...path, i]))
    .join('')

  if (children === '') return null

  switch (descendant.type) {
    case InlineType.Link:
      return `<a key="${pathToString(path)}">${children}</a>`
    case InlineType.SuperScript:
      return `<sup key="${pathToString(path)}">${children}</sup>`
    case InlineType.SubScript:
      return `<sub key="${pathToString(path)}">${children}</sub>`
    case InlineType.Code:
      return `<code key="${pathToString(path)}">${children}</code>`
    default:
      return children
  }
}

export function getRichTextV2TranslatableData(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
): Record<string, string> {
  const plugins: RichTextV2Plugin[] =
    definition?.config?.mode === RichTextV2Mode.Inline
      ? [InlineModePlugin()]
      : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin()]

  const editor: MakeswiftEditor = plugins.reduceRight(
    (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
    createEditor(),
  )

  editor.children = data.descendants
  editor.typographyNormalizationDirection = 'up'
  Editor.normalize(editor, { force: true })

  return editor.children.reduce(
    (acc, descendant: Descendant, i) => ({
      ...acc,
      ...getDescendantTranslatableData(descendant, [i]),
    }),
    {},
  )
}

function deserializeTranslationHtmlString(
  el: ChildNode | DocumentFragment,
  translationKey?: string,
): Descendant[] {
  if (el.nodeName === '#document-fragment') {
    const children = Array.from(el.childNodes)
      .map(element => deserializeTranslationHtmlString(element))
      .flat()

    if (children.length === 0) {
      children.push(jsx('text', {}, ''))
    }

    return children
  } else if (el.nodeName === '#text' && 'value' in el) {
    return [jsx('text', { translationKey: translationKey ?? undefined }, el.value)]
  } else if ('namespaceURI' in el) {
    const translationKey = el.attrs.find(a => a.name === 'key')?.value ?? undefined
    const children = Array.from(el.childNodes)
      .map(element => deserializeTranslationHtmlString(element, translationKey))
      .flat()

    if (children.length === 0) {
      children.push(jsx('text', {}, ''))
    }

    switch (el.nodeName) {
      case 'code':
        return [jsx('element', { type: InlineType.Code, translationKey }, children)]
      case 'sub':
        return [jsx('element', { type: InlineType.SubScript, translationKey }, children)]
      case 'sup':
        return [jsx('element', { type: InlineType.SuperScript, translationKey }, children)]
      case 'a':
        return [jsx('element', { type: InlineType.Link, translationKey }, children)]
      default:
        return children
    }
  }
  return []
}

export type RichTextV2ControlTranslationDto = Record<string, string>

export function mergeRichTextV2TranslatedData(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
  translatedData: RichTextV2ControlTranslationDto,
): RichTextV2ControlData {
  const plugins: RichTextV2Plugin[] =
    definition?.config?.mode === RichTextV2Mode.Inline
      ? [InlineModePlugin()]
      : [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin()]

  const sourceEditor: MakeswiftEditor = plugins.reduceRight(
    (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
    createEditor(),
  )

  const targetEditor: MakeswiftEditor = plugins.reduceRight(
    (editor, plugin) => plugin?.withPlugin?.(editor) ?? editor,
    createEditor(),
  )

  sourceEditor.children = data.descendants
  sourceEditor.typographyNormalizationDirection = 'up'
  Editor.normalize(sourceEditor, { force: true })

  Object.entries(translatedData)
    .reverse()
    .forEach(([blockStringPath, htmlString]) => {
      const blockPath = stringToPath(blockStringPath)
      if (blockPath.length === 0) return

      const html = parseFragment(htmlString)
      const inlineDescendants = deserializeTranslationHtmlString(html)

      targetEditor.children = [{ type: BlockType.Default, children: inlineDescendants }]

      targetEditor.typographyNormalizationDirection = 'neutral'
      Editor.normalize(targetEditor, { force: true })

      for (const [descendant, absolutePathToTargetNode] of Node.descendants(targetEditor)) {
        if (
          (!Text.isText(descendant) && !ElementUtils.isInline(descendant)) ||
          descendant.translationKey == null ||
          descendant.translationKey === ''
        ) {
          continue
        }

        const relativePathToSourceNode = stringToPath(descendant.translationKey)

        const absolutePathToSourceNode = [...blockPath, ...relativePathToSourceNode]

        const [sourceNode] = Editor.node(sourceEditor, absolutePathToSourceNode)

        if (Text.isText(sourceNode) && Text.isText(descendant)) {
          const { translationKey, text, ...rest } = sourceNode
          Transforms.setNodes(targetEditor, rest, { at: absolutePathToTargetNode })
          Transforms.unsetNodes(targetEditor, 'translationKey', { at: absolutePathToTargetNode })
        } else if (ElementUtils.isInline(sourceNode) && ElementUtils.isInline(descendant)) {
          const { translationKey, children, ...rest } = sourceNode
          Transforms.setNodes(targetEditor, rest, { at: absolutePathToTargetNode })
          Transforms.unsetNodes(targetEditor, 'translationKey', { at: absolutePathToTargetNode })
        }
      }
      const translatedChildren = (targetEditor.children.at(0) as Element)?.children

      Editor.withoutNormalizing(sourceEditor, () => {
        Array.from(Node.children(sourceEditor, blockPath))
          .reverse()
          .forEach(([_, path]) => {
            Transforms.removeNodes(sourceEditor, { at: path })
          })

        Transforms.insertNodes(sourceEditor, translatedChildren, { at: [...blockPath, 0] })
      })
    })

  sourceEditor.typographyNormalizationDirection = 'down'
  Editor.normalize(sourceEditor, { force: true })

  return { ...data, descendants: sourceEditor.children }
}
