'use client'

import { ReactNode, memo, useMemo, useEffect } from 'react'

import {
  createPropControllers,
  registerComponentHandleEffect,
  registerPropControllersEffect,
} from '../../../state/actions/internal/read-write-actions'
import { mountComponentEffect } from '../../../state/builder-api/actions'

import { useDispatch } from '../hooks/use-dispatch'
import { useDocumentKey } from '../hooks/use-document-context'

import { ElementImperativeHandle } from '../element-imperative-handle'

import { ControlInstancesProvider } from './control-instances-context'

export const ElementRegistration = memo(function ElementRegistration({
  elementKey,
  componentType,
  componentHandle,
  children,
}: {
  elementKey: string
  componentHandle: ElementImperativeHandle
  componentType: string
  children?: ReactNode
}): ReactNode {
  const dispatch = useDispatch()
  const documentKey = useDocumentKey()

  // Create control instances on first render and make them available down the React tree
  // through `ControlInstancesProvider`
  const controlInstancesContext = useMemo(
    () => ({
      elementKey,
      instances: documentKey
        ? dispatch(createPropControllers({ documentKey, elementKey, componentType }))
        : null,
    }),
    [dispatch, documentKey, elementKey, componentType],
  )

  const controlInstances = controlInstancesContext?.instances

  // Set control instances into the corresponding component handle
  useEffect(() => {
    if (controlInstances == null) return

    componentHandle.setPropControllers(controlInstances)
    return () => componentHandle.setPropControllers(null)
  }, [controlInstances, componentHandle])

  // Register the control instances and component handle in the state
  useEffect(() => {
    if (documentKey == null || controlInstances == null) return

    return dispatch(registerPropControllersEffect(documentKey, elementKey, controlInstances))
  }, [dispatch, documentKey, elementKey, controlInstances])

  useEffect(() => {
    if (documentKey == null) return

    return dispatch(registerComponentHandleEffect(documentKey, elementKey, componentHandle))
  }, [dispatch, documentKey, elementKey, componentHandle])

  // Register the element with to the builder
  useEffect(() => {
    if (documentKey == null) return

    return dispatch(mountComponentEffect(documentKey, elementKey))
  }, [dispatch, documentKey, elementKey])

  return (
    <ControlInstancesProvider value={controlInstancesContext}>{children}</ControlInstancesProvider>
  )
})

export default ElementRegistration
