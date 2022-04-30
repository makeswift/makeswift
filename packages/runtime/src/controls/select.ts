export const SelectControlType = 'makeswift::controls::select'

type SelectControlOption<T extends string> = { value: T; label: string }

type SelectControlConfig<T extends string = string> = {
  label?: string
  labelOrientation?: 'horizontal' | 'vertical'
  options: SelectControlOption<T>[]
  defaultValue?: T
}

export type SelectControlDefinition<C extends SelectControlConfig = SelectControlConfig> = {
  type: typeof SelectControlType
  config: C
}

export type SelectControlDefinitionOption<T extends SelectControlDefinition> =
  T['config'] extends SelectControlConfig<infer U> ? U : never

export type SelectControlData<T extends SelectControlDefinition = SelectControlDefinition> =
  SelectControlDefinitionOption<T>

export function Select<T extends string, C extends SelectControlConfig<T>>(
  config: C & { options: SelectControlOption<T>[] },
): SelectControlDefinition<C> {
  return { type: SelectControlType, config }
}
