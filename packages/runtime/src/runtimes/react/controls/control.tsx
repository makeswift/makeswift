'use client'

import {
  ControlDefinition,
  type InstanceType,
  type DataType,
  type ResolvedValueType,
  BoxDisplayModel,
  isNotNil,
} from '@makeswift/controls'
import { ReactNode, useEffect, useRef } from 'react'

import { useResolvedValue } from '../hooks/use-resolved-value'
import { useCssId } from '../hooks/use-css-id'
import { useBreakpoints } from '../hooks/use-breakpoints'
import { StylesheetEngine } from '../../../next/rsc/css/css-runtime'
import { StyleData } from '../../../next/rsc/css/server-css'
import { pollBoxModel } from '../poll-box-model'
import { ElementStyles } from '../../../components/shared/ElementStyles'

type ControlValueProps = {
  definition: ControlDefinition
  data: DataType<ControlDefinition> | undefined
  children(value: ResolvedValueType<ControlDefinition>): ReactNode
  control?: InstanceType<ControlDefinition>
}

/*
  note to self

  This is used for typography

*/
export function ControlValue({
  data,
  definition,
  children,
  control,
}: ControlValueProps): ReactNode {
  const breakpoints = useBreakpoints()
  const id = `cv-${useCssId()}`
  const stylesMap = useRef<Map<string, StyleData>>(new Map()).current
  const boxModelCallbacks = useRef<Record<string, (boxModel: BoxDisplayModel | null) => void>>({}).current

  const stylesheet = new StylesheetEngine(breakpoints, id, undefined, (classname, css, elementKey, propName, onBoxModelChange) => {
    stylesMap.set(classname, { css, propName })

    if (onBoxModelChange) {
      boxModelCallbacks[classname] = onBoxModelChange
    }
  })

  const value = useResolvedValue(
    data,
    (data, resourceResolver) =>
      definition.resolveValue(data, resourceResolver, stylesheet, control),
    (definition.config as any)?.defaultValue,
  )

  useEffect(() => {
    const unsubscribes = Object.entries(boxModelCallbacks)
      .map(([className, callback]) =>
        callback != null
          ? pollBoxModel({ element: document.querySelector(`.${className}`), onBoxModelChange: callback })
          : undefined,
      )
      .filter(isNotNil)
    return () => unsubscribes.forEach(fn => fn())
  }, [Object.keys(boxModelCallbacks).join(' ')])

  return (
    <>
      {children(value)}
      {ElementStyles({ stylesMap })}
    </>
  )
}
