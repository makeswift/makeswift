export type CheckboxControlData = boolean

export const CheckboxControlType = 'makeswift::controls::checkbox'

type CheckboxControlConfig = {
  label?: string
  defaultValue?: boolean
}

export type CheckboxControlDefinition<C extends CheckboxControlConfig = CheckboxControlConfig> = {
  type: typeof CheckboxControlType
  config: C
}

export function Checkbox<C extends CheckboxControlConfig>(
  config: C = {} as C,
): CheckboxControlDefinition<C> {
  return { type: CheckboxControlType, config }
}
