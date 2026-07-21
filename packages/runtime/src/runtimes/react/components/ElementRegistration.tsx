'use client'

import { ReactNode, memo, useMemo, useEffect } from 'react'

import { createPropControllers } from '../../../state/actions/internal/read-write-actions'
import {
  registerComponentHandleEffect,
  registerPropControllersEffect,
} from '../../../state/actions/internal/read-only-actions'
import { mountComponentEffect } from '../../../state/builder-api/actions'

import { useDispatch } from '../hooks/use-dispatch'
import { useDocumentKey } from '../hooks/use-document-context'
import { useDisableRegisterElement } from '../hooks/use-disable-register-element'

import { ElementImperativeHandle } from '../element-imperative-handle'

import { ControlInstancesProvider } from './control-instances-context'

type RegisterChildrenAsElementProps = {
  elementKey: string
  componentHandle: ElementImperativeHandle
  children?: ReactNode
}

export const ElementRegistration = memo(function ElementRegistration({
  elementKey,
  componentHandle,
  children,
}: RegisterChildrenAsElementProps): ReactNode {
  const dispatch = useDispatch()
  const documentKey = useDocumentKey()

  const isRegisterElementDisabled = useDisableRegisterElement()

  const controlInstances = useMemo(
    () => (documentKey ? dispatch(createPropControllers(documentKey, elementKey)) : null),
    [documentKey, elementKey],
  )

  useEffect(() => {
    if (documentKey == null || controlInstances == null || isRegisterElementDisabled) return

    return dispatch(registerPropControllersEffect(documentKey, elementKey, controlInstances))
  }, [dispatch, documentKey, elementKey, controlInstances, isRegisterElementDisabled])

  return (
    <ControlInstancesProvider value={controlInstances}>
      <ComponentRegistration elementKey={elementKey} componentHandle={componentHandle}>
        {children}
      </ComponentRegistration>
    </ControlInstancesProvider>
  )
})

export const ComponentRegistration = memo(function ElementRegistration({
  elementKey,
  componentHandle,
  children,
}: RegisterChildrenAsElementProps): ReactNode {
  const dispatch = useDispatch()
  const documentKey = useDocumentKey()

  const isRegisterElementDisabled = useDisableRegisterElement()

  useEffect(() => {
    if (documentKey == null || isRegisterElementDisabled) return

    return dispatch(registerComponentHandleEffect(documentKey, elementKey, componentHandle))
  }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

  useEffect(() => {
    if (documentKey == null || isRegisterElementDisabled) return

    return dispatch(mountComponentEffect(documentKey, elementKey))
  }, [dispatch, documentKey, elementKey, isRegisterElementDisabled])

  return <>{children}</>
})
