import {
  createContext,
  type ReactNode,
  type PropsWithChildren,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ForwardRefExoticComponent,
  type RefAttributes,
  forwardRef,
} from 'react'

import { type LinkData } from '@makeswift/prop-controllers'

import { type Snippet } from '../../../client'

import { BaseHeadSnippet } from './page/HeadSnippet'

type HeadComponent = (props: { children: ReactNode }) => ReactNode
type HeadSnippet = (props: { snippet: Snippet }) => ReactNode
type GoogleFontComponent = (props: { fonts: Font[]; siteId: string | null }) => ReactNode
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
export const DefaultHead = ({ children }: PropsWithChildren) => <>{children}</>

export const DefaultHeadSnippet = BaseHeadSnippet

export const DefaultImage: ImageComponent = ({ priority, fill, style, ...props }) => (
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

export const DefaultLink: LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ linkType, ...props }, ref) => <a {...props} ref={ref} />,
)

export const FrameworkContext = createContext<FrameworkContext>({
  Head: DefaultHead,
  HeadSnippet: DefaultHeadSnippet,
  Image: DefaultImage,
  Link: DefaultLink,
})
