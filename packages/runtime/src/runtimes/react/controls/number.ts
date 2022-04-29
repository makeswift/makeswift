import { NumberControlData, NumberControlDefinition } from '../../../controls'

export type NumberControlValue<T extends NumberControlDefinition> =
  undefined extends T['config']['defaultValue'] ? NumberControlData | undefined : NumberControlData

export function useNumber<T extends NumberControlDefinition>(
  numberControlData: number | undefined,
  controlDefinition: T,
): NumberControlValue<T> {
  return (numberControlData ?? controlDefinition.config.defaultValue) as NumberControlValue<T>
}
