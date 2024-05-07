import { Data } from '@makeswift/controls'

export const ComboboxControlType = 'makeswift::controls::combobox'

type ComboboxControlOption<T extends Data> = { id: string; label: string; value: T }

type ComboboxControlConfig<T extends Data = Data> = {
  label?: string
  getOptions(query: string): ComboboxControlOption<T>[] | Promise<ComboboxControlOption<T>[]>
}

export type ComboboxControlDefinition<C extends ComboboxControlConfig = ComboboxControlConfig> = {
  type: typeof ComboboxControlType
  config: C
}

export type ComboboxControlDefinitionOption<T extends ComboboxControlDefinition> =
  T['config'] extends ComboboxControlConfig<infer U> ? U : never

export type ComboboxControlData<T extends ComboboxControlDefinition = ComboboxControlDefinition> =
  ComboboxControlOption<ComboboxControlDefinitionOption<T>>

export function Combobox<T extends Data, C extends ComboboxControlConfig<T>>(
  config: C & {
    getOptions(query: string): ComboboxControlOption<T>[] | Promise<ComboboxControlOption<T>[]>
  },
): ComboboxControlDefinition<C> {
  return { type: ComboboxControlType, config }
}
