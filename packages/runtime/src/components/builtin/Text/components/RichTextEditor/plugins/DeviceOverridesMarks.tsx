// import type { Plugin } from '../../../../../../old-slate-react-types'

import Mark from '../components/Mark'

const TYPOGRAPHY_TYPE = 'typography'

export default function DeviceOverridesMarksPlugin(): any /* Plugin  */ {
  return {
    renderMark({ mark, children }: any, _editor: any, next: () => any) {
      if (mark.type === TYPOGRAPHY_TYPE) {
        return <Mark value={mark.data.get('value')}>{children}</Mark>
      }

      return next()
    },
  }
}
