import { DEFAULT_CSS_PRECEDENCE } from "../constants"
import { useStylesContext } from "../hooks/use-styles-context"

export function MakeswiftStyle({ href, css, precedence }: { href: string, css: string, precedence?: string}) {
  const { shouldRenderStyleElements } = useStylesContext()
  if (!shouldRenderStyleElements) return null
  return (
    <style href={href} precedence={precedence ?? DEFAULT_CSS_PRECEDENCE}>
      {css}
    </style>
  )
}
