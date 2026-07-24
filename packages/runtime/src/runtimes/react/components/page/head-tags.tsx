import { type ComponentPropsWithoutRef } from 'react'

import { useFrameworkContext } from '../hooks/use-framework-context'
import { MakeswiftStyle } from '../../css-runtime/components/makeswift-style'

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

type PageStyleProps = {
  styleElement: React.ReactElement<ComponentPropsWithoutRef<typeof MakeswiftStyle>>
}
export function PageStyle({ styleElement }: PageStyleProps) {
  const { Head } = useFrameworkContext()
  return (
    <Head>
      {styleElement}
    </Head>
  )
}
