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
import { Element } from './Element'
import { Document } from './Document'
import { DisableRegisterElement } from '../hooks/use-disable-register-element'
import { useDocumentLocale } from '../hooks/use-document-context'

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
          <DisableRegisterElement.Provider value={true}>
            {/* We render Element instead of ElementData because we rely on the FindDomNode */}
            <Element element={globalElementData} ref={ref} />
          </DisableRegisterElement.Provider>
        )}
      </DocumentCyclesContext.Provider>
    )
  }),
)
