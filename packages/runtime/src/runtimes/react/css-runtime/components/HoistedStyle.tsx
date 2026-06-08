export function HoistedStyle({ href, css, precedence }: { href: string, css: string, precedence?: string}) {
  return (
    <style href={href} precedence={precedence ?? "default"}>
      {css}
    </style>
  )
}
