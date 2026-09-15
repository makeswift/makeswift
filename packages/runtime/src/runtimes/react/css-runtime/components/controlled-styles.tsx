'use client'

import { ReactNode, useEffect } from 'react'
import { pollBoxModel } from '../../poll-box-model'
import { MakeswiftStyle } from './makeswift-style'
import { ControlledStyleData } from '../types'
import { getControlledStylePrecedence } from '../utils'
import { useIsInBuilder } from '../../hooks/use-is-in-builder'

type Props = {
  classNameToStyles: ReadonlyMap<string, ControlledStyleData>
}

/*
  Note the importance of prop resolution having completed, such that the store
  (`classNameToStyles`) has been fully populated.
*/
export function ControlledStyles({ classNameToStyles }: Props): ReactNode {
  return (
    <>
      {Array.from(classNameToStyles.entries()).map(([className, styleData]) => {
        return <ControlledStyle className={className} styleData={styleData} key={className} />
      })}
    </>
  )
}

export function ControlledStyle({
  className,
  styleData,
}: {
  className: string
  styleData: ControlledStyleData
}): ReactNode {
  const isInBuilder = useIsInBuilder()

  // Do not list the style data's box model callback in dependencies, as this will lead
  // to visually jarring overlay redraws in the builder
  useEffect(() => {
    if (isInBuilder) {
      const onBoxModelChange = styleData.onBoxModelChange
      if (onBoxModelChange == null) return

      const findElement = () => document.querySelector(`.${className}`)
      let element = findElement()

      return pollBoxModel({
        getElement: () => {
          // The 'isConnected' check is important to RSC re-renders, where the DOM node bearing the controlled class gets replaced
          if (element == null || !element.isConnected) {
            element = findElement()
          }
          return element
        },
        onBoxModelChange,
      })
    }
    return () => {}
  }, [className, isInBuilder])

  return (
    <MakeswiftStyle
      href={className}
      css={styleData.css}
      precedence={getControlledStylePrecedence(styleData)}
    />
  )
}
