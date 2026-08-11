import { type ComponentProps } from 'react'

import { MakeswiftComponent as MakeswiftClientComponent } from '../../components/MakeswiftComponent'

import { RSCSnapshotRenderer } from './snapshot-renderer'

export const MakeswiftServerComponent = (
  props: ComponentProps<typeof MakeswiftClientComponent>,
) => (
  <RSCSnapshotRenderer {...props}>
    <MakeswiftClientComponent {...props} />
  </RSCSnapshotRenderer>
)
