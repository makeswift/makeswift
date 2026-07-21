import { type ReactNode } from 'react'

import { RichTextV2Definition } from '../../../../controls/rich-text-v2'

export type RichTextV2ControlValue = ReactNode
export type Descriptors = { text?: RichTextV2Definition }

export { renderRichTextV2 } from './render-rich-text-v2'
