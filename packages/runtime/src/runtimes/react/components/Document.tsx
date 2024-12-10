import { Ref, forwardRef, memo } from 'react'
import { type Document as ReactPageDocument } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { DocumentContext } from '../hooks/use-document-context'
import { Element } from './Element'
import { getRootElementFromDocument } from '../../../state/utils/get-root-element-from-document'

type DocumentProps = {
  document: ReactPageDocument
}

export const Document = memo(
  forwardRef(function Document(
    { document }: DocumentProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const rootElement = getRootElementFromDocument(document)

    return (
      <DocumentContext.Provider value={document}>
        <Element ref={ref} element={rootElement} />
      </DocumentContext.Provider>
    )
  }),
)
