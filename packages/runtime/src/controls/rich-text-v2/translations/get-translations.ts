import escapeHtml from 'escape-html'
import { Descendant, Editor, Text } from 'slate'

import { type TranslationDto, Slate } from '@makeswift/controls'

import { RichTextV2Plugin } from '../plugin'
import { InlineType } from '../../../slate/types'
import { createEditorWithPlugins, pathToString, RichTextTranslationDto } from './translations-core'

function getDescendantTranslatableData(descendant: Descendant, path: number[]): TranslationDto {
  if (Text.isText(descendant)) {
    return {}
  }

  if (Slate.isList(descendant) || Slate.isListItem(descendant)) {
    return descendant.children.reduce(
      (acc, d, j) => ({ ...acc, ...getDescendantTranslatableData(d, [...path, j]) }),
      {},
    )
  }

  const text = getInlineOrTextTranslatableData(descendant)
  if (text == null) return {}

  return { [pathToString(path)]: text }
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

export function getTranslatableData(
  nodes: Slate.Descendant[],
  plugins: RichTextV2Plugin[],
): RichTextTranslationDto {
  const editor = createEditorWithPlugins(plugins)

  editor.children = nodes
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
