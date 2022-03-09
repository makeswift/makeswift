import type { Plugin } from 'slate-react'

import Mark from '../components/Mark'

const TYPOGRAPHY_TYPE = 'typography'

export default function DeviceOverridesMarksPlugin(): Plugin {
  return {
    renderMark({ mark, children }, _editor, next) {
      if (mark.type === TYPOGRAPHY_TYPE) {
        return <Mark value={mark.data.get('value')}>{children}</Mark>
      }

      return next()
    },
  }
}
