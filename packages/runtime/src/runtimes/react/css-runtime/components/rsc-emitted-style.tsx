'use client'

import { useEffect } from 'react'
import { useStylesContext } from '../hooks/use-styles-context'
import { ControlledStyleData, MakeswiftStylePrecedence } from '../types'
import { MakeswiftStyle } from './makeswift-style'

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

  return (
    <MakeswiftStyle
      href={serializableData.className}
      css={serializableData.css}
      precedence={MakeswiftStylePrecedence.MEDIUM}
    />
  )
}
