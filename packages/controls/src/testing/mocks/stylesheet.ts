import { type Breakpoints } from '../../breakpoints'
import { type BoxModel, type ResponsiveValue } from '../../common/types'
import {
  type ResolvedStyleData,
  type StyleProperty,
} from '../../controls/style'
import { Stylesheet } from '../../stylesheet'

export const noOpStylesheet: Stylesheet = {
  breakpoints(): Breakpoints {
    return []
  },

  defineStyle(
    _props: StyleProperty[],
    _style: ResponsiveValue<any> | ResolvedStyleData,
    _onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string {
    return ''
  },

  child(_id: string): Stylesheet {
    return noOpStylesheet
  },
}
