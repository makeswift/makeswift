import { type ReactNode } from 'react'
import { SlotDefinition, SlotControl, type DataType } from '@makeswift/controls'

import { type SlotConfig } from '../../../../controls/slot'

import { SlotValue } from './slot-value'

export function renderSlot({
  data,
  control,
  config,
}: {
  data: DataType<SlotDefinition<ReactNode>> | undefined
  control: SlotControl | null
  config: SlotConfig
}): ReactNode {
  return control ? (
    <SlotValue data={data} instanceKey={control.instanceKey} config={config} />
  ) : (
    <div>CONTROL IS REQUIRED</div>
  )
}
