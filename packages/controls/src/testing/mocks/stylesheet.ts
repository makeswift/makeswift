import { type Breakpoints } from '../../breakpoints'
import { type BoxModel, type ResponsiveValue } from '../../common/types'
import { type ResolvedStyleV1, type Stylesheet } from '../../stylesheet'

export const noOpStylesheet: Stylesheet = {
  breakpoints(): Breakpoints {
    return []
  },

  defineStyle(
    _style: ResolvedStyleV1 | ResponsiveValue<any>,
    _onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string {
    return ''
  },

  child(_id: string): Stylesheet {
    return noOpStylesheet
  },
}
