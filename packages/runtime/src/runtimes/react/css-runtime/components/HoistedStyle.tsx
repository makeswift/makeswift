export function HoistedStyle({ href, css }: { href: string, css: string }) {
  return (
    <style href={href} precedence="default">
      {css}
    </style>
  )
}
