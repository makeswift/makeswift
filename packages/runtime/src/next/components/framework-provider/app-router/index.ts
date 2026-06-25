import { type FrameworkContext } from '../../../../runtimes/react/components/framework-context'

import { HeadSnippet } from './HeadSnippet'

export const context: Pick<FrameworkContext, 'HeadSnippet'> = {
  // The App Router uses built-in React Canary releases, which include all stable
  // React 19 features, so we can simply use our default head implementation
  HeadSnippet,
}
