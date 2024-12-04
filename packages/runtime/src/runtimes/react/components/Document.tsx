import { ReactNode, Ref, forwardRef, memo } from 'react'
import { type Document as ReactPageDocument } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { DocumentContext } from '../hooks/use-document-context'
import { ElementWithFallback } from './Element'
import { getRootElementFromDocument } from '../../../state/utils/get-root-element-from-document'

type DocumentProps = {
  document: ReactPageDocument
  fallback?: ReactNode
}

export const Document = memo(
  forwardRef(function Document(
    { document, fallback }: DocumentProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const isInitialData = document.rootElement == null
    const rootElement = getRootElementFromDocument(document)

    return (
      <DocumentContext.Provider value={document}>
        <ElementWithFallback
          ref={ref}
          element={rootElement}
          fallback={fallback}
          isInitialData={isInitialData}
        />
      </DocumentContext.Provider>
    )
  }),
)
