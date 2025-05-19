import { ComponentPropsWithoutRef } from 'react'
// import { useIsPagesRouter } from '../hooks/use-is-pages-router'
// import Head from 'next/head'

type PageTitleProps = Omit<ComponentPropsWithoutRef<'title'>, 'children'> & {
  children?: string
}

export function PageTitle({ children, ...props }: PageTitleProps) {
  // DECOUPLE_TODO:
  // if (useIsPagesRouter()) {
  //   return (
  //     <Head>
  //       <title {...props}>{children}</title>
  //     </Head>
  //   )
  // }
  return <title {...props}>{children}</title>
}

export function PageMeta(props: ComponentPropsWithoutRef<'meta'>) {
  // if (useIsPagesRouter()) {
  //   return (
  //     <Head>
  //       <meta {...props} />
  //     </Head>
  //   )
  // }
  return <meta {...props} />
}

type ReactCanaryLinkProps = {
  precedence?: 'reset' | 'low' | 'medium' | 'high'
}
type PageLinkProps = ComponentPropsWithoutRef<'link'> & ReactCanaryLinkProps

export function PageLink({ precedence, ...props }: PageLinkProps) {
  // if (useIsPagesRouter()) {
  //   return (
  //     <Head>
  //       <link {...props} />
  //     </Head>
  //   )
  // }
  // @ts-expect-error: currently, react types don't include a prop definition
  // for `precedence` since it's a React Canary feature. See
  // https://react.dev/reference/react-dom/components/link#props. The
  // functionality is supported because Next.js App Router uses React Canary.
  return <link {...props} precedence={precedence} />
}

type ReactCanaryStyleProps = {
  precedence?: 'reset' | 'low' | 'medium' | 'high'
  href?: string
}
type PageStyleProps = ComponentPropsWithoutRef<'style'> & ReactCanaryStyleProps

export function PageStyle({ children, precedence, href, ...props }: PageStyleProps) {
  // if (useIsPagesRouter()) {
  //   return (
  //     <Head>
  //       <style {...props}>{children}</style>
  //     </Head>
  //   )
  // }
  return (
    // @ts-expect-error: currently react types don't include prop definitions
    // for `precedence` & `href` since it's a React Canary feature. See
    // https://react.dev/reference/react-dom/components/style#props. The
    // functionality is supported because Next.js App Router uses React Canary.
    <style {...props} precedence={precedence} href={href}>
      {children}
    </style>
  )
}
