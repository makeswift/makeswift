import { useEffect, useLayoutEffect, useMemo } from 'react'
import { type Document } from '../../../state/react-page'
import { useDispatch } from './use-dispatch'
import { useIsInBuilder } from './use-is-in-builder'
import { registerBuilderDocumentsEffect, registerDocumentsEffect } from '../../../state/actions'
import { isServer } from '../../../utils/is-server'

/**
 * @param document Document to register
 */
export function useRegisterDocument(document: Document): void {
  const isInBuilder = useIsInBuilder()
  const dispatch = useDispatch()

  const documentArray = useMemo(() => [document], [document])

  if (isServer()) {
    dispatch(registerDocumentsEffect(documentArray))
  }

  /*
    Layout effect is to ensure that the document registration happens prior to the
    attempted creation/registration of prop controllers in child components.
  */
  useLayoutEffect(() => {
    return dispatch(registerDocumentsEffect(documentArray))
  }, [dispatch, documentArray])

  // TODO: Decide whether to do this via middleware or via explicit action (like
  // what we're doing below)
  useEffect(() => {
    if (!isInBuilder) return
    return dispatch(registerBuilderDocumentsEffect(documentArray))
  }, [isInBuilder, documentArray])
}
