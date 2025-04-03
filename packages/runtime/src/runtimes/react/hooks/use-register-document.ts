import { useEffect } from 'react'
import { type Document } from '../../../state/react-page'
import { useDispatch } from './use-dispatch'
import { useIsInBuilder } from './use-is-in-builder'
import { registerBuilderDocumentsEffect, registerDocument, registerDocumentsEffect } from '../../../state/actions'
import { isServer } from '../../../utils/is-server'
import { useIsomorphicLayoutEffect } from '../../../components/hooks/useIsomorphicLayoutEffect'

/**
 * @param document Document to register
 */
export function useRegisterDocument(document: Document): void {
  const isInBuilder = useIsInBuilder()
  const dispatch = useDispatch()

  if (isServer()) {
    dispatch(registerDocument(document))
  }

  /*
    Layout effect is to ensure that the document registration happens prior to the
    attempted creation/registration of prop controllers in child components.
  */
  useIsomorphicLayoutEffect(() => {
    return dispatch(registerDocumentsEffect([document]))
  }, [dispatch, document])

  // TODO: Decide whether to do this via middleware or via explicit action (like
  // what we're doing below)
  useEffect(() => {
    if (!isInBuilder) return
    return dispatch(registerBuilderDocumentsEffect([document]))
  }, [isInBuilder, document])
}
