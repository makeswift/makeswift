import { cx } from '@emotion/css'
import { forwardRef } from 'react'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { RichTextV2ControlValue } from '../../../runtimes/react/controls/rich-text-v2'

type Props = {
  id?: ElementIDValue
  text?: RichTextV2ControlValue
  width?: string
  margin?: string
}

const Text = forwardRef<HTMLDivElement, Props>(({ id, text, width, margin }, ref) => {
  return (
    <div id={id} ref={ref} className={cx(width, margin)}>
      {text}
    </div>
  )
})

export default Text
