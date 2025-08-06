import Head from 'next/head'

import { type FrameworkContext } from '../../../../runtimes/react/components/framework-context'

import { HeadSnippet } from './HeadSnippet'

export const context: FrameworkContext = {
  Head,
  HeadSnippet,
}
