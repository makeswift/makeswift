export type TextInputControlData = string

export const TextInputControlType = 'makeswift::controls::text-input'

type TextInputControlConfig = {
  label?: string
  defaultValue?: string
}

export type TextInputControlDefinition<C extends TextInputControlConfig = TextInputControlConfig> =
  {
    type: typeof TextInputControlType
    config: C
  }

export function TextInput<C extends TextInputControlConfig>(
  config: C = {} as C,
): TextInputControlDefinition<C> {
  return { type: TextInputControlType, config }
}
