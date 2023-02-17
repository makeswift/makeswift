import { TypographyMarkValue } from '../../Text/components/RichTextEditor/components/Mark'

export const TextTypes = {
  Typography: 'typography',
  Code: 'code',
  SuperScript: 'superscript',
  SubScript: 'subscript',
  Link: 'link',
  Unknown: 'unknown',
} as const

export type TextTypes = typeof TextTypes[keyof typeof TextTypes]

export type TypographyText = {
  type: typeof TextTypes.Typography
  text: string
  typography: TypographyMarkValue
}

export type TextUnion = { text: string; type: 'unknown' } | TypographyText
