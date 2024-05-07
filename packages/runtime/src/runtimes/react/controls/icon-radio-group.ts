import { IconRadioGroupControlData, IconRadioGroupControlDefinition } from '@makeswift/controls'

export type IconRadioGroupControlValue<T extends IconRadioGroupControlDefinition> =
  undefined extends T['config']['defaultValue']
    ? IconRadioGroupControlData | undefined
    : IconRadioGroupControlData

export function useIconRadioGroupValue<T extends IconRadioGroupControlDefinition>(
  iconRadioGroupControlData: IconRadioGroupControlData | undefined,
  controlDefinition: T,
): IconRadioGroupControlValue<T> {
  return (iconRadioGroupControlData ??
    controlDefinition.config.defaultValue) as IconRadioGroupControlValue<T>
}
