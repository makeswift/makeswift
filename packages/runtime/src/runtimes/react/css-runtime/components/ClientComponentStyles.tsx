'use client'

import { ReactNode, useEffect } from "react"
import { DefinedStyleData } from "../css-runtime"
import { pollBoxModel } from "../../poll-box-model"

type Props = {
  classNameToStyles: Map<string, DefinedStyleData>
}

export function ClientComponentStyles({ classNameToStyles }: Props): ReactNode {
  const keysSignature = Array.from(classNameToStyles.keys()).sort().join('|')
  useEffect(() => {
    const unsubscribes: Array<() => void> = []
    for (const [className, styleData] of classNameToStyles.entries()) {
      const element = document.querySelector(`.${className}`)
      if (styleData.onBoxModelChange != null) {
        unsubscribes.push(pollBoxModel({ element, onBoxModelChange: styleData.onBoxModelChange }))
      }
    }
    return () => unsubscribes.forEach(fn => fn())
  }, [keysSignature])

  return <>
    {Array.from(classNameToStyles.entries()).map(([className, styleData]) => (
      <style key={className}>{styleData.css}</style>
    ))}
  </>
}
