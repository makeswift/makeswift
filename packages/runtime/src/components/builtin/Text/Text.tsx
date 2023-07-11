import { cx } from '@emotion/css'
import { ElementIDValue } from '../../../prop-controllers/descriptors'
import { RichTextV2ControlValue } from '../../../runtimes/react/controls/rich-text-v2'

type Props = {
  id?: ElementIDValue
  text?: RichTextV2ControlValue
  width?: string
  margin?: string
}

function Text({ id, text, width, margin }: Props) {
  return (
    <div id={id} className={cx(width, margin)}>
      {text}
    </div>
  )
}

export default Text
