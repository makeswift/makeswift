import { type ComponentPropsWithoutRef } from 'react'

import { useFrameworkContext } from '../hooks/use-framework-context'

type PageTitleProps = Omit<ComponentPropsWithoutRef<'title'>, 'children'> & {
  children?: string
}

export function PageTitle({ children, ...props }: PageTitleProps) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      <title {...props}>{children}</title>
    </Head>
  )
}

export function PageMeta(props: ComponentPropsWithoutRef<'meta'>) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      <meta {...props} />
    </Head>
  )
}

type ReactCanaryLinkProps = {
  precedence?: 'reset' | 'low' | 'medium' | 'high'
}
type PageLinkProps = ComponentPropsWithoutRef<'link'> & ReactCanaryLinkProps

export function PageLink({ precedence, ...props }: PageLinkProps) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      <link {...props} precedence={precedence} />
    </Head>
  )
}

type PageStyleProps = ReactCanaryLinkProps & {
  // React dedupes hoisted styles by `href`, so it must change whenever `children` does
  href: string
  children: string
}

export function PageStyle({ href, precedence, children }: PageStyleProps) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      <style href={href} precedence={precedence}>
        {children}
      </style>
    </Head>
  )
}
