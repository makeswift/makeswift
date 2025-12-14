import { Ref, forwardRef, memo, ReactNode } from 'react'

import { type Document } from '../../../state/read-only-state'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useDocument } from '../hooks/use-document'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { Document as DocumentComponent } from './Document'

type Props = {
  rootDocument: Document
}

export const DocumentRoot = memo(
  forwardRef(function DocumentRoot(
    { rootDocument }: Props,
    ref: Ref<ElementImperativeHandle>,
  ): ReactNode {
    const document = useDocument(rootDocument.key) ?? rootDocument

    if (document == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Document not found" />
    }

    return <DocumentComponent ref={ref} document={document} />
  }),
)
