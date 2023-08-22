import { Descendant, Text } from 'slate'
import escapeHtml from 'escape-html'
import { RichTextV2ControlData, RichTextV2ControlDefinition } from './rich-text-v2'
import { InlineType } from '../../slate/types'

function hashTranslationString(s: string): string {
  let hash = 0
  for (let i = 0, len = s.length; i < len; i++) {
    let chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash.toString()
}

function getRichTextV2TranslatableDescendant(
  definition: RichTextV2ControlDefinition,
  descendant: Descendant,
): string {
  if (Text.isText(descendant)) {
    let string = escapeHtml(descendant.text)
    return string
  }

  const children = descendant.children
    .map((child: Descendant) => getRichTextV2TranslatableDescendant(definition, child))
    .join('')

  switch (descendant.type) {
    case InlineType.Link:
      return `<a>${children}</a>`
    case InlineType.Link:
      return `<sup>${children}</sup>`
    case InlineType.Link:
      return `<sub>${children}</sub>`
    case InlineType.Link:
      return `<code>${children}</code>`
    default:
      return children
  }
}

export function getRichTextV2TranslatableData(
  definition: RichTextV2ControlDefinition,
  data: RichTextV2ControlData,
): Record<string, string> {
  return data.descendants.reduce((acc, descendant: Descendant) => {
    const value = getRichTextV2TranslatableDescendant(definition, descendant)

    const key = hashTranslationString(value)

    return { ...acc, [key]: value }
  }, {})
}
