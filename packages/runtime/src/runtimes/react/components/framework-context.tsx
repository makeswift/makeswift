import { createContext, type ReactNode, type PropsWithChildren, type CSSProperties } from 'react'

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

export type FrameworkContext = {
  Head: HeadComponent
  HeadSnippet: HeadSnippet
  Image: ImageComponent
}

// React 19 automatically hoists metadata tags to the <head>
export const DefaultHead = ({ children }: PropsWithChildren) => <>{children}</>

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

export const FrameworkContext = createContext<FrameworkContext>({
  Head: DefaultHead,
  HeadSnippet: BaseHeadSnippet,
  Image: DefaultImage,
})
