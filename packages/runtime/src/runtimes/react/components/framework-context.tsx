'use client'

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
import { type Middleware } from '@reduxjs/toolkit'
import { type ElementData as ElementDataValue } from '@makeswift/controls'

import { type LinkData } from '@makeswift/prop-controllers'

import { type Snippet } from '../../../client'
import { type HttpFetch } from '../../../state/makeswift-api-client'
import {
  ApiHandlerHeaders,
  serializeSiteVersion,
  type SiteVersion,
} from '../../../api/site-version'
import { type State, type Dispatch } from '../../../state/react-builder-preview'
import { ElementData } from './ElementData'

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

type ElementDataComponent = typeof ElementData

export type FrameworkContext = {
  Head: HeadComponent
  HeadSnippet: HeadSnippet
  Image: ImageComponent
  Link: LinkComponent
  versionedFetch: (siteVersion: SiteVersion | null) => HttpFetch
  ElementData: ElementDataComponent
  previewStoreMiddlewares?: Middleware<Dispatch, State, Dispatch>[]
  /**
   * Callback to trigger an RSC refresh (re-fetch RSC payload from server).
   * Used when non-style props change on RSC elements in the builder.
   */
  refreshRSC?: () => void
  /**
   * Callback to render a single RSC element on the server and return the result.
   * Used by V2 subtree replacement to update individual server components
   * without re-rendering the entire RSC tree.
   */
  refreshRSCElement?: (
    elementData: ElementDataValue,
    documentContext: { key: string; locale: string | null },
  ) => Promise<ReactNode>
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

export const versionedFetch: FrameworkContext['versionedFetch'] = siteVersion => (url, init) =>
  fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      ...(siteVersion != null
        ? { [ApiHandlerHeaders.SiteVersion]: serializeSiteVersion(siteVersion) }
        : {}),
    },
  })

export const DefaultElementData = ElementData

export const FrameworkContext = createContext<FrameworkContext>({
  Head: DefaultHead,
  HeadSnippet: DefaultHeadSnippet,
  Image: DefaultImage,
  Link: DefaultLink,
  ElementData: DefaultElementData,
  versionedFetch,
})
