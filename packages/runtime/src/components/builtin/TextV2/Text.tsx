import { ForwardedRef, forwardRef } from 'react'
import { RichTextValue } from '../../../prop-controllers'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { EditableText } from './EditableText'
import { RichTextControlDefinitionV2, RichTextControlV2 } from '../../../controls'

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
  definition?: RichTextControlDefinitionV2
  control: RichTextControlV2 | null
}

const Text = forwardRef(function Text(props: Props, ref: ForwardedRef<any>) {
  return <EditableText {...props} ref={ref} />
})

export default Text
