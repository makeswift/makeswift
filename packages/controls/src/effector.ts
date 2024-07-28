import { type ResponsiveValue, type BoxModel } from './common/types'
import { type StyleProperty, type ResolvedStyleData } from './style'

export class Effects {
  constructor(
    private effects: (() => void)[] = [],
    private asyncEffects: (() => Promise<unknown>)[] = [],
  ) {}

  add(effect: () => void) {
    this.effects.push(effect)
  }

  addAsync(effect: () => Promise<unknown>) {
    this.asyncEffects.push(effect)
  }

  async run() {
    while (this.effects.length > 0) {
      this.effects.shift()?.()
    }

    while (this.asyncEffects.length > 0) {
      const asyncEffects = this.asyncEffects.slice()
      this.asyncEffects = []
      await Promise.all(asyncEffects.map((effect) => effect()))
    }
  }
}

export interface Effector {
  computeClassName(
    previous: string | undefined,
    props: StyleProperty[],
    style: ResponsiveValue<any> | ResolvedStyleData,
  ): string

  defineStyle(
    className: string,
    props: StyleProperty[],
    style: ResponsiveValue<any> | ResolvedStyleData,
    onBoxModelChange?: (boxModel: BoxModel | null) => void,
  ): void
}

export const noOpEffector: Effector = {
  computeClassName: () => '',
  defineStyle: () => {},
}
