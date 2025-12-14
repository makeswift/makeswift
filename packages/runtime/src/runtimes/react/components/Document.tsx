import { Ref, forwardRef, memo, ReactNode } from 'react'

import { type Document as ReactPageDocument, getRootElement } from '../../../state/read-only-state'

import { ElementImperativeHandle } from '../element-imperative-handle'
import { DocumentKeyContext, DocumentLocaleContext } from '../hooks/use-document-context'
import { Element } from './Element'

type DocumentProps = {
  document: ReactPageDocument
}

export const Document = memo(
  forwardRef(function Document(
    { document }: DocumentProps,
    ref: Ref<ElementImperativeHandle>,
  ): ReactNode {
    return (
      <DocumentKeyContext.Provider value={document.key}>
        <DocumentLocaleContext.Provider value={document.locale}>
          <Element ref={ref} element={getRootElement(document)} />
        </DocumentLocaleContext.Provider>
      </DocumentKeyContext.Provider>
    )
  }),
)
