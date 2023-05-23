import { BoxModel } from 'css-box-model'
import { ControlDefinition, ControlDefinitionData } from './control'
import { PropController } from '../prop-controllers/base'
import { Send } from '../prop-controllers/instances'
import { ResponsiveValue } from './types'
import { CSSObject } from '@emotion/serialize'
import { useStyle } from '../runtimes/react/use-style'

export const StyleV2ControlType = 'makeswift::controls::style-v2'

export type StyleV2CSSObject = CSSObject
export const unstable_useStyleV2ClassName = useStyle

type StyleV2ControlConfig<T extends ControlDefinition = ControlDefinition> = {
  type: T
  getStyle(item: ControlDefinitionData<T> | undefined): CSSObject
}

export type StyleV2ControlDefinition = {
  type: typeof StyleV2ControlType
  config: StyleV2ControlConfig
}

export function unstable_StyleV2<C extends StyleV2ControlConfig>(
  config: C,
): StyleV2ControlDefinition {
  return { type: StyleV2ControlType, config }
}

/**
 * TODO: Rewrite `ControlDefinitionData` as a tail recursive type.
 *
 * Explanation: Making `StyleV2ControlData` generic causes us to hit a limitation of TS conditional types for the definition of `ControlDefinitionData`.
 * We get "Type instantiation is excessively deep and possibly infinite."
 *
 * Helpful links:
 * * The PR changing the limit of conditional types: https://github.com/microsoft/TypeScript/pull/45711
 * * TS 4.5 docs releasing this limitation: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types
 * * A SO user implementing a tail recursive type: https://stackoverflow.com/questions/72370456/tail-recursion-elimination-on-conditional-types-doesnt-work
 *
 *
 * This is what the type should be:
 * ```
 * export type StyleV2ControlData<T extends StyleV2ControlDefinition = StyleV2ControlDefinition> =
 *   ResponsiveValue<ControlDefinitionData<T['config']['type']>>
 * ```
 */
export type StyleV2ControlData = ResponsiveValue<any>

export const StyleV2ControlMessageType = {
  CHANGE_BOX_MODEL: 'makeswift::controls::style::message::change-box-model',
} as const

type StyleV2ControlItemBoxModelChangeMessage = {
  type: typeof StyleV2ControlMessageType.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

export type StyleV2ControlMessage = StyleV2ControlItemBoxModelChangeMessage

export class StyleV2Control extends PropController<StyleV2ControlMessage> {
  constructor(send: Send<StyleV2ControlMessage>) {
    super(send)
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: StyleV2ControlMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }

  recv() {}
}
