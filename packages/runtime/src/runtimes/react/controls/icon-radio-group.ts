import { type DataType, type ResolvedValueType } from '@makeswift/controls'

import { IconRadioGroupDefinition } from '../../../controls'

export function useIconRadioGroupValue(
  iconRadioGroupControlData: DataType<IconRadioGroupDefinition> | undefined,
  controlDefinition: IconRadioGroupDefinition,
): ResolvedValueType<IconRadioGroupDefinition> {
  return iconRadioGroupControlData ?? controlDefinition.config.defaultValue
}
