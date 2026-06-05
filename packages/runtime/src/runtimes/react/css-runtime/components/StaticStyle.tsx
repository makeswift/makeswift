import { HoistedStyle } from "./HoistedStyle"

export function StaticStyle({ className, css }: { className: string, css: string }) {
  const href = `${className}`
  return <HoistedStyle href={href} css={css} />
}
