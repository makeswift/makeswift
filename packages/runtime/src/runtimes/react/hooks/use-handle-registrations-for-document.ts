import { useEffect } from 'react'
import { type Document } from '../../../state/react-page'
import { useDispatch } from './use-dispatch'
import { useIsInBuilder } from './use-is-in-builder'
import { registerBuilderDocumentsEffect, registerDocumentsEffect } from '../../../state/actions'
import { createAndRegisterPropControllersEffect } from '../../../state/react-builder-preview'

/**
 * @param document Document to register
 */
export function useHandleRegistrationsForDocument(document: Document): void {
  const isInBuilder = useIsInBuilder()
  const dispatch = useDispatch()

  useEffect(() => dispatch(registerDocumentsEffect([document])), [document])

  // TODO: Decide whether to do this via middleware or via explicit action (like
  // what we're doing below)
  useEffect(() => {
    if (!isInBuilder) return
    return dispatch(registerBuilderDocumentsEffect([document]))
  }, [isInBuilder, document])

  useEffect(() => {
    if (!isInBuilder) return
    return dispatch(createAndRegisterPropControllersEffect([document]))
  }, [isInBuilder, document])
}
