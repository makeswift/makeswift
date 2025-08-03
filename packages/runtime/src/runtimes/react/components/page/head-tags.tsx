import { type ReactNode, type ComponentPropsWithoutRef } from 'react'

import Head from 'next/head'

export type HeadComponentProp = {
  Head: (props: { children: ReactNode }) => JSX.Element
}

type PageTitleProps = Omit<ComponentPropsWithoutRef<'title'>, 'children'> &
  HeadComponentProp & {
    children?: string
  }

export function PageTitle({ children, Head, ...props }: PageTitleProps) {
  return (
    <Head>
      <title {...props}>{children}</title>
    </Head>
  )
}

export function PageMeta(props: HeadComponentProp & ComponentPropsWithoutRef<'meta'>) {
  return (
    <Head>
      <meta {...props} />
    </Head>
  )
}

type ReactCanaryLinkProps = {
  precedence?: 'reset' | 'low' | 'medium' | 'high'
}
type PageLinkProps = ComponentPropsWithoutRef<'link'> & HeadComponentProp & ReactCanaryLinkProps

export function PageLink({ precedence, ...props }: PageLinkProps) {
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
type PageStyleProps = ComponentPropsWithoutRef<'style'> & HeadComponentProp & ReactCanaryStyleProps

export function PageStyle({ children, precedence, href, ...props }: PageStyleProps) {
  return (
    <Head>
      {/* @ts-expect-error `precedence` and `href` are React 19 features */}
      <style {...props} precedence={precedence} href={href}>
        {children}
      </style>
    </Head>
  )
}
