'use client'

import { ReactNode, useContext } from 'react'
import { PropsContext } from '../../../next/components/SlotProvider'

type Props = {
  children: ReactNode
  showFallback: boolean
}

function Slot(props: Props) {
  const ctx = useContext(PropsContext)

  return <>{props.showFallback ? ctx.fallback : props.children}</>
}

export default Slot
