import { ReactNode } from "react"
import { StyleData } from "../../next/rsc/css/server-css"


// TODO move StyleData type somewhere else
type Props = {
  stylesMap: Map<string, StyleData>
}

export function ElementStyles({ stylesMap }: Props): ReactNode {
  return Array.from(stylesMap.entries()).map(([className, { css }]) => (
    <style key={className}>{css}</style>
  ))
}