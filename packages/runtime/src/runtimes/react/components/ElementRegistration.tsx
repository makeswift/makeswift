'use client'

import { ReactNode, memo, useEffect } from 'react'
import { ElementImperativeHandle } from '../element-imperative-handle'
import { useDispatch } from '../hooks/use-dispatch'
import { useDocumentKey } from '../hooks/use-document-context'
import { useDisableRegisterElement } from '../hooks/use-disable-register-element'
import { mountComponentEffect, registerComponentHandleEffect } from '../../../state/actions'

type RegisterChildrenAsElementProps = {
  elementKey: string
  componentHandle: ElementImperativeHandle
  children?: ReactNode
}

export const ElementRegistration = memo(function ElementRegistration({
  elementKey,
  componentHandle,
  children,
}: RegisterChildrenAsElementProps): JSX.Element {
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
