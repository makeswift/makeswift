import Head from 'next/head'

import { type FrameworkContext } from '../../../../runtimes/react/components/framework-context'
import { FontLink } from '../../../../runtimes/react/components/FontLink'

import { HeadSnippet } from './HeadSnippet'

export const context: Pick<FrameworkContext, 'Head' | 'HeadSnippet' | 'GoogleFont'> = {
  Head,
  HeadSnippet,
  GoogleFont: FontLink,
}
