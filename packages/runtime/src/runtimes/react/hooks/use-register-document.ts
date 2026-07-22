import { useEffect, useMemo } from 'react'
import { type Document } from '../../../state/read-only-state'
import { useDispatch } from './use-dispatch'
import { useIsInBuilder } from './use-is-in-builder'
import { registerDocument, unregisterDocument } from '../../../state/shared-api'
import {
  registerBuilderDocument,
  unregisterBuilderDocument,
} from '../../../state/builder-api/actions'

/**
 * @param document Document to register
 */
export function useRegisterDocument(document: Document): void {
  const isInBuilder = useIsInBuilder()
  const dispatch = useDispatch()

  // Register the document synchronously during render (via `useMemo`, not an effect)
  // to guarantee that we have it in the store before any descendants render and
  // attempt to read it (e.g. to register their own prop controllers). This is safe
  // to do on every render because `registerDocument` is idempotent: re-dispatching
  // it with the same document is a no-op change in effect. Compare to `useCacheData`,
  // which relies on the same pattern.
  useMemo(() => dispatch(registerDocument(document)), [dispatch, document])

  useEffect(() => {
    // Unregister in an effect; because we're unregistering based on the document
    // key rather than the entire document, there is no risk of synchronization
    // issues along the lines of "the document changed, `useMemo` updated it in
    // the state, then `useEffect` unregistered it".
    //
    // Abandoned/interrupted renders aren't a concern either: retries just
    // re-dispatch the same idempotent registration. In the worst case, a render
    // that executes `useMemo` but never commits will simply create a ghost state
    // that either will be overwritten by a later successful registration of the
    // same key, or sit unused until the client state is discarded.
    return () => {
      dispatch(unregisterDocument(document.key))
    }
  }, [dispatch, document.key])

  // TODO: Decide whether to do this via middleware or via explicit action (like
  // what we're doing below)
  useMemo(() => {
    if (!isInBuilder) return
    dispatch(registerBuilderDocument(document))
  }, [dispatch, isInBuilder, document])

  useEffect(() => {
    if (!isInBuilder) return
    const documentKey = document.key

    return () => {
      dispatch(unregisterBuilderDocument(documentKey))
    }
  }, [dispatch, isInBuilder, document.key])
}
