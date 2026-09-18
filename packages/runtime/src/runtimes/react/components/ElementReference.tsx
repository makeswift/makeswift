import { Ref, forwardRef, memo, useMemo, ReactNode } from 'react'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useGlobalElement, useLocalizedGlobalElement } from '../hooks/makeswift-api'
import { useDocument } from '../hooks/use-document'
import { DocumentCyclesContext, useDocumentCycles } from '../hooks/use-document-cycles'
import {
  ElementData as ReactPageElementData,
  ElementReference as ReactPageElementReference,
} from '../../../state/read-only-state'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { useElementImperativeHandle, ErrorFallback } from './Element'
import { Document } from './Document'
import { useDocumentLocale } from '../hooks/use-document-context'

import { ErrorBoundary } from '../../../components/shared/ErrorBoundary'
import { ElementData } from './ElementData'
import { FindDomNode } from '../find-dom-node'

type ElementRefereceProps = {
  elementReference: ReactPageElementReference
}

export const ElementReference = memo(
  forwardRef(function ElementReference(
    { elementReference }: ElementRefereceProps,
    ref: Ref<ElementImperativeHandle>,
  ): ReactNode {
    const globalElement = useGlobalElement(elementReference.value)
    const locale = useDocumentLocale()
    // Update the logic here when we can merge element trees
    const localizedGlobalElement = useLocalizedGlobalElement(locale, elementReference.value)
    const globalElementData = (localizedGlobalElement?.data ?? globalElement?.data) as
      | ReactPageElementData
      | undefined
    const elementReferenceDocument = useDocument(elementReference.key)
    const documentKey = elementReference.key
    const documentKeys = useDocumentCycles()
    const providedDocumentKeys = useMemo(
      () => [...documentKeys, documentKey],
      [documentKeys, documentKey],
    )

    console.log('@@ ElementReference (client)', { elementReference, elementReferenceDocument })

    if (globalElementData == null) {
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="This global component doesn't exist"
        />
      )
    }

    if (documentKeys.includes(documentKey)) {
      return (
        <FallbackComponent
          ref={ref as Ref<HTMLDivElement>}
          text="This global component contains itself!"
        />
      )
    }

    return (
      <DocumentCyclesContext.Provider value={providedDocumentKeys}>
        {elementReferenceDocument != null ? (
          <Document document={elementReferenceDocument} ref={ref} />
        ) : (
          <ElementReferenceData elementData={globalElementData} ref={ref} />
        )}
      </DocumentCyclesContext.Provider>
    )
  }),
)

const ElementReferenceData = memo(
  forwardRef(function Element(
    { elementData }: { elementData: ReactPageElementData },
    ref: Ref<ElementImperativeHandle>,
  ): ReactNode | null {
    const { findDomNodeCallbackRef, elementCallbackRef } = useElementImperativeHandle(ref)

    return (
      <FindDomNode ref={findDomNodeCallbackRef}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ElementData
            key={elementData.key}
            ref={elementCallbackRef}
            elementData={elementData}
            isReferenceData={true}
          />
        </ErrorBoundary>
      </FindDomNode>
    )
  }),
)
