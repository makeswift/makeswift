import { ForwardedRef, forwardRef } from 'react'
import { RichTextValue } from '../../../prop-controllers'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { EditableText } from './EditableText'
import { RichTextControlDefinitionV2 } from '../../../controls'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
  definition?: RichTextControlDefinitionV2
}

const Text = forwardRef(function Text(props: Props, ref: ForwardedRef<any>) {
  return <EditableText {...props} ref={ref} />
})

export default Text
