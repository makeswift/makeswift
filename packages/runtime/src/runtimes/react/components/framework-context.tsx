import {
  type ReactNode,
  type PropsWithChildren,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ForwardRefExoticComponent,
  type RefAttributes,
  forwardRef,
  createContext,
  useContext,
  useMemo,
} from 'react'

import { type LinkData } from '@makeswift/prop-controllers'

import { type Snippet } from '../../../client'

import { BaseHeadSnippet } from './page/HeadSnippet'

type HeadComponent = (props: { children: ReactNode }) => ReactNode
type HeadSnippet = (props: { snippet: Snippet }) => ReactNode
type ImageComponent = (props: {
  src: string
  alt: string
  sizes?: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  style?: CSSProperties
}) => ReactNode

type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'onClick'> & {
  linkType?: LinkData['type']
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => unknown
}

type LinkComponent = ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement> & LinkProps>

export type FrameworkContext = {
  Head: HeadComponent
  HeadSnippet: HeadSnippet
  Image: ImageComponent
  Link: LinkComponent
}

// React 19 automatically hoists metadata tags to the <head>
const DefaultHead = ({ children }: PropsWithChildren) => <>{children}</>

const DefaultHeadSnippet = BaseHeadSnippet

const DefaultImage: ImageComponent = ({ priority, fill, style, ...props }) => (
  <img
    {...props}
    style={{
      ...(fill
        ? {
            height: '100%',
            width: '100%',
            objectFit: 'cover',
          }
        : {}),
      ...style,
    }}
    loading={priority ? 'eager' : 'lazy'}
  />
)

const DefaultLink: LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ linkType, ...props }, ref) => <a {...props} ref={ref} />,
)

const FrameworkContext = createContext<Partial<FrameworkContext>>({})

export const FrameworkContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: Partial<FrameworkContext> }>) => {
  const parentContext = useContext(FrameworkContext)
  const mergedContext = useMemo(() => ({ ...parentContext, ...value }), [parentContext, value])

  return <FrameworkContext.Provider value={mergedContext}>{children}</FrameworkContext.Provider>
}

const defaultContext: FrameworkContext = {
  Head: DefaultHead,
  HeadSnippet: DefaultHeadSnippet,
  Image: DefaultImage,
  Link: DefaultLink,
}

export function useFrameworkContext(): FrameworkContext {
  return { ...defaultContext, ...useContext(FrameworkContext) }
}
