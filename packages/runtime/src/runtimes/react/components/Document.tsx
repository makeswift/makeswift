import { Ref, forwardRef, memo } from 'react'
import { Document as ReactPageDocument } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { DocumentContext } from '../hooks/use-document-key'
import { Element } from './Element'

type DocumentProps = {
  document: ReactPageDocument
}

export const Document = memo(
  forwardRef(function Document(
    { document }: DocumentProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    return (
      <DocumentContext.Provider value={document.key}>
        <Element ref={ref} element={document.rootElement} />
      </DocumentContext.Provider>
    )
  }),
)
