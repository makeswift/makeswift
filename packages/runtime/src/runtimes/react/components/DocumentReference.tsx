import { Ref, forwardRef, memo } from 'react'
import { DocumentReference as ReactPageDocumentReference } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useDocument } from '../hooks/use-document'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { Document } from './Document'

type DocumentReferenceProps = {
  documentReference: ReactPageDocumentReference
}

export const DocumentReference = memo(
  forwardRef(function DocumentReference(
    { documentReference }: DocumentReferenceProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const document = useDocument(documentReference.key)

    if (document == null) {
      return <FallbackComponent ref={ref as Ref<HTMLDivElement>} text="Document not found" />
    }

    return <Document ref={ref} document={document} />
  }),
)
