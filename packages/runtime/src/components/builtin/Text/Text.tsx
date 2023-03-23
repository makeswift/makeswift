import dynamic from 'next/dynamic'
import { ForwardedRef, forwardRef } from 'react'
import { forwardNextDynamicRef } from '../../../next'
import { RichTextValue } from '../../../prop-controllers'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { useIsPreview } from '../../../runtimes/react'

const EditableText = forwardNextDynamicRef(patch => dynamic(() => patch(import('./EditableText'))))
const ReadOnlyText = forwardNextDynamicRef(patch => dynamic(() => patch(import('./ReadOnlyText'))))

type Props = {
  id?: ElementIDValue
  text?: RichTextValue
  width?: string
  margin?: string
}

const Text = forwardRef(function Text(props: Props, ref: ForwardedRef<any>) {
  const isPreview = useIsPreview()

  return isPreview ? <EditableText {...props} ref={ref} /> : <ReadOnlyText {...props} ref={ref} />
})

export default Text
