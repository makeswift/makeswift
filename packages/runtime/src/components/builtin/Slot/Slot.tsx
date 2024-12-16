'use client'

import { ReactNode, useContext } from "react"
import { PropsContext } from "../../../next/components/Slot"

type Props = {
  children: ReactNode
  showFallback: boolean
}

export const Slot = (props: Props) => {
  const ctx = useContext(PropsContext)

  return (
      <>
        { props.showFallback ? ctx.fallback : props.children }
      </>
  )
}

export default Slot
