import { type ComponentProps } from 'react'

import { MakeswiftComponent as MakeswiftClientComponent } from '../../components/MakeswiftComponent'

import { RSCSnapshotRenderer } from './snapshot-renderer'

/**
 * Renders Makeswift component snapshot with server-element support. RSC counterpart of
 * https://docs.makeswift.com/developer/docs/reference/components/makeswift-component#props
 */
export const MakeswiftComponent = (props: ComponentProps<typeof MakeswiftClientComponent>) => (
  <RSCSnapshotRenderer {...props}>
    <MakeswiftClientComponent {...props} />
  </RSCSnapshotRenderer>
)
