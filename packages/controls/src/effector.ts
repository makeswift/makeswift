import { type ResponsiveValue, type BoxModel } from './common/types'
import { type StyleProperty, type ResolvedStyleData } from './style'

export interface Effector {
  defineStyle(
    name: string | undefined,
    props: StyleProperty[],
    style: ResponsiveValue<any> | ResolvedStyleData,
    onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string
}

export const noOpEffector: Effector = {
  defineStyle: () => '',
}
