import { TextStyleControlData, TextStyleControlDefinition } from '../../../controls'

export type TextStyleControlValue<T extends TextStyleControlDefinition> =
  undefined extends T['config']['defaultValue']
    ? TextStyleControlData | undefined
    : TextStyleControlData

export function useTextStyleValue<T extends TextStyleControlDefinition>(
  data: TextStyleControlData | undefined,
  definition: T,
): TextStyleControlValue<T> {
  return { ...definition.config.defaultValue, ...data } as TextStyleControlValue<T>
}
