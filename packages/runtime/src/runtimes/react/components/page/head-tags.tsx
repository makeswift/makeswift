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
      {/* @ts-expect-error `precedence` is a React 19 feature */}
      <link {...props} precedence={precedence} />
    </Head>
  )
}

type ReactCanaryStyleProps = {
  precedence?: 'reset' | 'low' | 'medium' | 'high'
  href?: string
}
type PageStyleProps = ComponentPropsWithoutRef<'style'> & ReactCanaryStyleProps

export function PageStyle({ children, precedence, href, ...props }: PageStyleProps) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      {/* @ts-expect-error `precedence` and `href` are React 19 features */}
      <style {...props} precedence={precedence} href={href}>
        {children}
      </style>
    </Head>
  )
}
