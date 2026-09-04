'use client'

import { useEffect } from 'react'
import { useStylesContext } from '../hooks/use-styles-context'
import { ControlledStyleData } from '../types'
import { ControlledStyle } from './controlled-styles'

type Props = {
  namespace: string
  serializableData: Omit<ControlledStyleData, 'onBoxModelChange'>
}

export function RSCEmittedStyle({ namespace, serializableData }: Props) {
  const { stylesRegistry } = useStylesContext()

  useEffect(() => {
    stylesRegistry.setControlledStyle({
      namespace,
      className: serializableData.className,
      data: serializableData,
    })
  }, [stylesRegistry, namespace, serializableData.className, serializableData.contentHash])

  return <ControlledStyle className={serializableData.className} styleData={serializableData} />
}
