import { ForwardedRef, forwardRef } from 'react'
import { RichTextValue } from '../../../prop-controllers'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { EditableText } from './EditableText'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const Text = forwardRef(function Text(props: Props, ref: ForwardedRef<any>) {
  return <EditableText {...props} ref={ref} />
})

export default Text
