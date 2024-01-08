import { match } from 'ts-pattern'
import { NumberControlData, NumberControlDataTypeKey, NumberControlDataTypeValueV1, NumberControlDefinition } from '../../../controls'

export type NumberControlValue<T extends NumberControlDefinition> =
  undefined extends T['config']['defaultValue'] ? number | undefined : number

export function useNumber<T extends NumberControlDefinition>(
  data: NumberControlData | undefined,
  definition: T,
): NumberControlValue<T> {
  const value: number | undefined = match(data)
    .with({ [NumberControlDataTypeKey]: NumberControlDataTypeValueV1 }, (val) => val.value)
    .otherwise(val => val) ?? definition.config.defaultValue

  return value as NumberControlValue<T>
}
