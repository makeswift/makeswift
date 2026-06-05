'use client'

import { ReactNode, useEffect } from "react"
import { ControlledStyleData } from "../hooks/use-controlled-styles"
import { pollBoxModel } from "../../poll-box-model"
import { HoistedStyle } from "./HoistedStyle"

type Props = {
  classNameToStyles: Map<string, ControlledStyleData>
}

export function ControlledStyles({ classNameToStyles }: Props): ReactNode {
  return (
    <>
      {Array.from(classNameToStyles.entries()).map(([className, styleData]) => {
        return (
          <ControlledStyle
            className={className}
            styleData={styleData}
            key={className}
          />
        )
      })}
    </>
  )
}

function ControlledStyle({
  className,
  styleData,
}: {
  className: string,
  styleData: ControlledStyleData,
}): ReactNode {
  const href = `${className}-${styleData.counter}`

  useEffect(() => {
    const onBoxModelChange = styleData.onBoxModelChange
    if (onBoxModelChange == null) return
    const element = document.querySelector(`.${className}`)
    return pollBoxModel({ element, onBoxModelChange})
  }, [className])

  return <HoistedStyle href={href} css={styleData.css} />
}