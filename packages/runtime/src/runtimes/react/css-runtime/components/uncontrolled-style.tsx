import { MakeswiftStyle } from "./makeswift-style"

// TODO probably can delete this? Just use MakeswiftStyle directly?
export function UncontrolledStyle({ className, css, precedence }: { className: string, css: string, precedence?: string }) {
  const href = `${className}`
  return <MakeswiftStyle href={href} css={css} precedence={precedence} />
}
