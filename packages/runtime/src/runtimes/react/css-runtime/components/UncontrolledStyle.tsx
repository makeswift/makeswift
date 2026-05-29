import { HoistedStyle } from "./HoistedStyle"

export function UncontrolledStyle({ className, css, precedence }: { className: string, css: string, precedence?: string }) {
  const href = `${className}`
  return <HoistedStyle href={href} css={css} precedence={precedence} />
}
