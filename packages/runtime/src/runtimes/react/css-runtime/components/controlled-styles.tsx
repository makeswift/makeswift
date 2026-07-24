'use client'

import { ReactNode, useEffect } from "react"
import { pollBoxModel } from "../../poll-box-model"
import { MakeswiftStyle } from "./makeswift-style"
import { ControlledStyleData } from "../types"

type Props = {
  classNameToStyles: Map<string, ControlledStyleData>
}

/*
  Note the importance of prop resolution having completed, such that the store
  (`classNameToStyles`) has been fully populated.
*/
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
  options = {},
}: {
  className: string,
  styleData: ControlledStyleData,
  options?: { precedence?: string },
}): ReactNode {
  useEffect(() => {
    const onBoxModelChange = styleData.onBoxModelChange
    if (onBoxModelChange == null) return
    const element = document.querySelector(`.${className}`)
    return pollBoxModel({ element, onBoxModelChange})
  }, [className])

  return <MakeswiftStyle href={className} css={styleData.css} precedence={options.precedence} />
}
