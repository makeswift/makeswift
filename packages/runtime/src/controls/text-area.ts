export type TextAreaControlData = string

export const TextAreaControlType = 'makeswift::controls::text-area'

type TextAreaControlConfig = {
  label?: string
  defaultValue?: string
  rows?: number
}

export type TextAreaControlDefinition<C extends TextAreaControlConfig = TextAreaControlConfig> = {
  type: typeof TextAreaControlType
  config: C
}

export function TextArea<C extends TextAreaControlConfig>(
  config: C = {} as C,
): TextAreaControlDefinition<C> {
  return { type: TextAreaControlType, config }
}
