'use client'

import { ReactNode, useEffect } from "react"
import { DefinedStyleData } from "../css-runtime"
import { pollBoxModel } from "../../poll-box-model"

type Props = {
  classNameToStyles: Map<string, DefinedStyleData>
}

export function ClientComponentStyles({ classNameToStyles }: Props): ReactNode {
  return (
    <>
      {Array.from(classNameToStyles.entries()).map(([className, styleData]) => {
        return (
          <ClientComponentStyle
            className={className}
            styleData={styleData}
            key={className}
          />
        )
      })}
    </>
  )
}

function ClientComponentStyle({
  className,
  styleData,
}: {
  className: string,
  styleData: DefinedStyleData,
}): ReactNode {
  const href = `${className}-${styleData.counter}`

  useEffect(() => {
    const onBoxModelChange = styleData.onBoxModelChange
    if (onBoxModelChange == null) return
    const element = document.querySelector(`.${className}`)
    return pollBoxModel({ element, onBoxModelChange})
  }, [className])

  return (
    <style href={href} precedence="default">
      {styleData.css}
    </style>
  )
}