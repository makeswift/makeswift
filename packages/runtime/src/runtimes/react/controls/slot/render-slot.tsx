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
  // To make `SlotValue` interactive in the builder after it has been rendered as part of an
  // RSC component's server output and hydrated on the client, we need some way to connect
  // it to the corresponding control instance. Handling this purely client-side isn't an
  // option, as by itself the rendered slot has no identity we could use to look up its control
  // instance. Instantiating the instance on the server and simply passing it as a prop is
  // also not an option, as class instances like `SlotControl` can't cross the RSC server-client
  // serialization boundary. We can, however, pass the control's `instanceKey` instead, and use
  // it to look up the corresponding client-side control instance in `SlotValue` via
  // `useControlInstance`, and it works equally well for purely client-side rendering.
  return <SlotValue data={data} instanceKey={control?.instanceKey} config={config} />
}
