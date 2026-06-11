import { CSSObject, serializeStyles } from "@emotion/serialize"
import { HoistedStyle } from "./HoistedStyle"
import { murmur3 } from "murmurhash-js"
import { defaultClassNamePrefix } from "../css-runtime"

type Props = {
  styles: Array<CSSObject>
}

/*
  "Note the precedence values themselves are arbitrary and their naming is up to you. React will infer that precedence
  values it discovers first are 'lower' and precedence values it discovers later are 'higher'."
*/
const precedence = "low"
const globalStyleHrefPrefix = `${defaultClassNamePrefix}-global`

export function GlobalStyle({ styles }: Props) {
  const href = `${globalStyleHrefPrefix}-${murmur3(JSON.stringify(styles)).toString(36)}`
  const serialized = serializeStyles(styles)
  return (
    <HoistedStyle
      href={href}
      css={serialized.styles}
      precedence={precedence}
    />
  )
}
