import { type ReactNode } from 'react'
import { type MakeswiftComponentSnapshot } from '../../../../client/component-snapshot'
import { MakeswiftComponentType } from '../../../../components/builtin/constants'

import { MakeswiftServerComponent } from './makeswift-component'

type Props = {
  label: string
  snapshot: MakeswiftComponentSnapshot
  fallback?: ReactNode
}

export const Slot = ({ label, snapshot /*, fallback*/ }: Props) => {
  // FIXME: fallback support
  return (
    <MakeswiftServerComponent
      snapshot={snapshot}
      label={label}
      type={MakeswiftComponentType.Slot}
    />
  )
}
