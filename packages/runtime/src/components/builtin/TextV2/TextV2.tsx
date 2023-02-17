import { ForwardedRef, forwardRef } from 'react'
import { RichTextValue } from '../../../prop-controllers'
import { ElementIDValue } from '../../../prop-controllers/descriptors'

import { EditableTextV2 } from './EditableTextV2'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const Text = forwardRef(function Text(props: Props, ref: ForwardedRef<unknown>) {
  return <EditableTextV2 {...props}  />
})

export default Text
