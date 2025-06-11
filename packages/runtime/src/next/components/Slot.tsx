'use client'

import { ReactNode, useMemo } from 'react'
import { MakeswiftComponentSnapshot } from '../../client'
import { MakeswiftComponentType } from '../../components'
import { MakeswiftComponent } from './MakeswiftComponent'
import SlotProvider from './SlotProvider'

type Props = {
  label: string
  snapshot: MakeswiftComponentSnapshot
  fallback?: ReactNode
}

export const Slot = ({ label, snapshot, fallback }: Props) => {
  const contextValue = useMemo(() => ({ fallback }), [fallback])

  return (
    <SlotProvider value={contextValue}>
      <MakeswiftComponent snapshot={snapshot} label={label} type={MakeswiftComponentType.Slot} />
    </SlotProvider>
  )
}

export default Slot
