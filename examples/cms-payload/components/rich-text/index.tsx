import React from 'react'

import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'

import { jsxConverter } from './converters'

type Props = {
  data: SerializedEditorState
} & React.HTMLAttributes<HTMLDivElement>

export function RichText({ data, className, ...rest }: Props) {
  return <RichTextConverter data={data} className={className} converters={jsxConverter} {...rest} />
}
