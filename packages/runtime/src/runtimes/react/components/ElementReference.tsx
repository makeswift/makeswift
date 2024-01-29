import { Ref, forwardRef, memo, useMemo } from 'react'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useGlobalElement, useLocalizedGlobalElement } from '../hooks/makeswift-api'
import { useDocument } from '../hooks/use-document'
import { DocumentCyclesContext, useDocumentCycles } from '../hooks/use-document-cycles'
import {
  ElementData as ReactPageElementData,
  ElementReference as ReactPageElementReference,
} from '../../../state/react-page'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { ElementData } from './ElementData'
import { Document } from './Document'
import { DisableRegisterElement } from '../hooks/use-disable-register-element'

type ElementRefereceProps = {
  elementReference: ReactPageElementReference
}

export const ElementReference = memo(
  forwardRef(function ElementReference(
    { elementReference }: ElementRefereceProps,
    ref: Ref<ElementImperativeHandle>,
  ): JSX.Element {
    const globalElement = useGlobalElement(elementReference.value)
    // Update the logic here when we can merge element trees
    const localizedGlobalElement = useLocalizedGlobalElement(elementReference.value)
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
            <ElementData elementData={globalElementData} ref={ref} />
          </DisableRegisterElement.Provider>
        )}
      </DocumentCyclesContext.Provider>
    )
  }),
)
