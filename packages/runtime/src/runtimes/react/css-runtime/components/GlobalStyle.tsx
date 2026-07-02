import { CSSObject } from "@emotion/serialize"
import { HoistedStyle } from "./HoistedStyle"
import { serializeStyles } from "../css-runtime"
import { DEFAULT_CSS_CLASS_NAME_PREFIX } from "../constants"

type Props = {
  styles: Array<CSSObject>
}

/*
  "Note the precedence values themselves are arbitrary and their naming is up to you. React will infer that precedence
  values it discovers first are 'lower' and precedence values it discovers later are 'higher'."
*/
const precedence = "low"
const globalStyleHrefPrefix = `${DEFAULT_CSS_CLASS_NAME_PREFIX}-global`

export function GlobalStyle({ styles }: Props) {
  const { content, contentHash } = serializeStyles(styles)
  const href = `${globalStyleHrefPrefix}-${contentHash}`

  return (
    <HoistedStyle
      href={href}
      css={content}
      precedence={precedence}
    />
  )
}
