export const unstable_IconRadioGroupIcon = {
  TextAlignCenter: 'TextAlignCenter',
  TextAlignJustify: 'TextAlignJustify',
  TextAlignLeft: 'TextAlignLeft',
  TextAlignRight: 'TextAlignRight',
  Superscript: 'Superscript16',
  Subscript: 'Subscript16',
  Code: 'Code16',
} as const

export type IconRadioGroupIcon =
  typeof unstable_IconRadioGroupIcon[keyof typeof unstable_IconRadioGroupIcon]

export const IconRadioGroupControlType = 'makeswift::controls::icon-radio-group'

export type IconRadioGroupOption<T extends string> = {
  value: T
  icon: IconRadioGroupIcon
  label: string
}

type IconRadioGroupControlConfig<T extends string = string> = {
  label?: string
  defaultValue?: T
  options: IconRadioGroupOption<T>[]
}

export type IconRadioGroupControlDefinition<
  C extends IconRadioGroupControlConfig = IconRadioGroupControlConfig,
> = {
  type: typeof IconRadioGroupControlType
  config: C
}

export type IconRadioGroupControlDefinitionOption<
  T extends IconRadioGroupControlDefinition = IconRadioGroupControlDefinition,
> = T['config'] extends IconRadioGroupControlConfig<infer U> ? U : never

export type IconRadioGroupControlData<
  T extends IconRadioGroupControlDefinition = IconRadioGroupControlDefinition,
> = IconRadioGroupControlDefinitionOption<T>

export function unstable_IconRadioGroup<T extends string, C extends IconRadioGroupControlConfig<T>>(
  config: C & { options: IconRadioGroupOption<T>[] },
): IconRadioGroupControlDefinition<C> {
  return { type: IconRadioGroupControlType, config }
}
