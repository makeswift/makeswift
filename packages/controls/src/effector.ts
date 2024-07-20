import { type ResponsiveValue, type BoxModel } from './common/types'
import { type StyleProperty, type ResolvedStyleData } from './style'

export interface Effector {
  queueEffect(effect: () => void): void
  queueAsyncEffect(effect: () => Promise<unknown>): void

  defineStyle(
    className: string | undefined,
    props: StyleProperty[],
    style: ResponsiveValue<any> | ResolvedStyleData,
    onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): string
}

export const noOpEffector: Effector = {
  queueEffect: () => {},
  queueAsyncEffect: () => {},
  defineStyle: () => '',
}
