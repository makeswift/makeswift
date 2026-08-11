import { type ComponentProps } from 'react'

import { MakeswiftComponentType } from '../../../../components/builtin/constants'

import { Slot as ClientSlot } from '../../components/Slot'

import { RSCSnapshotRenderer } from './snapshot-renderer'

export const Slot = ({ label, snapshot, fallback }: ComponentProps<typeof ClientSlot>) => (
  <RSCSnapshotRenderer snapshot={snapshot} label={label} type={MakeswiftComponentType.Slot}>
    <ClientSlot {...{ label, snapshot, fallback }} />
  </RSCSnapshotRenderer>
)
