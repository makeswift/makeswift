import { Editor } from 'slate'
import { List } from './ListPlugin'
import { Typography } from './TypographyPlugin'
import { Block } from './BlockPlugin'

export * from './ListPlugin'
export * from './TypographyPlugin'
export * from './BlockPlugin'
export * from './utils'

export const MyEditor = {
  ...Editor,
  ...List,
  ...Typography,
  ...Block,
}
