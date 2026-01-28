import { type PropsWithChildren, useState } from 'react'

import {
  FrameworkContext,
  DefaultHead,
  DefaultHeadSnippet,
  DefaultImage,
  DefaultLink,
  versionedFetch,
} from '@makeswift/runtime/unstable-framework-support'

type ImageRewriter = (src: string) => string

export const createImageComponent =
  ({ rewriter }: { rewriter?: ImageRewriter }): FrameworkContext['Image'] =>
  ({ src, ...props }) => <DefaultImage src={rewriter ? rewriter(src) : src} {...props} />

export function FrameworkProvider({
  children,
  imageRewriter,
}: PropsWithChildren & {
  imageRewriter?: ImageRewriter
}) {
  const [context] = useState<FrameworkContext>({
    Head: DefaultHead,
    HeadSnippet: DefaultHeadSnippet,
    Image: createImageComponent({ rewriter: imageRewriter }),
    Link: DefaultLink,
    versionedFetch,
  })

  return <FrameworkContext.Provider value={context}>{children}</FrameworkContext.Provider>
}
