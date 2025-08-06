import { createContext, type ReactNode, type PropsWithChildren } from 'react'

import { type Snippet } from '../../../client'

import { BaseHeadSnippet } from './page/HeadSnippet'

type HeadComponent = (props: { children: ReactNode }) => ReactNode
type HeadSnippet = (props: { snippet: Snippet }) => ReactNode

export type FrameworkContext = {
  Head: HeadComponent
  HeadSnippet: HeadSnippet
}

// React 19 automatically hoists metadata tags to the <head>
export const DefaultHead = ({ children }: PropsWithChildren) => <>{children}</>

export const FrameworkContext = createContext<FrameworkContext>({
  Head: DefaultHead,
  HeadSnippet: BaseHeadSnippet,
})
