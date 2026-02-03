import { useEffect } from 'react'
import { type Document } from '../../../state/react-page'
import { useDispatch } from './use-dispatch'
import { useIsInBuilder } from './use-is-in-builder'
import { registerDocument, registerDocumentsEffect } from '../../../state/shared-api'
import { registerBuilderDocumentsEffect } from '../../../state/builder-api/actions'

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
    Use document.key as dependency to avoid re-running on RSC refresh when only
    the object reference changes but the content is the same.
  */
  useIsomorphicLayoutEffect(() => {
    return dispatch(registerDocumentsEffect([document]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, document.key])

  // TODO: Decide whether to do this via middleware or via explicit action (like
  // what we're doing below)
  useEffect(() => {
    if (!isInBuilder) return
    return dispatch(registerBuilderDocumentsEffect([document]))
  }, [isInBuilder, document.key])
}
