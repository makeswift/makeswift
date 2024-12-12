import { Ref, forwardRef, memo } from 'react'
import { type Document as ReactPageDocument, getRootElement } from '../../../state/react-page'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { DocumentContext } from '../hooks/use-document-context'
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
      <DocumentContext.Provider value={document}>
        <Element ref={ref} element={getRootElement(document)} />
      </DocumentContext.Provider>
    )
  }),
)
