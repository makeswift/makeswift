import { useEffect } from 'react'
import type { ThunkAction } from '@reduxjs/toolkit'

import { type Dispatch } from '../../../state/react-page'
import { type Action } from '../../../state/actions'

import { isServer } from '../../../utils/is-server'

// overloaded signatures
export function useUniversalDispatch<Args extends any[], A extends Action>(
  dispatch: Dispatch,
  action: (...args: Args) => A,
  args: Args,
): void
export function useUniversalDispatch<Args extends any[], A extends Action>(
  dispatch: Dispatch,
  action: (...args: Args) => ThunkAction<() => void, any, any, A>,
  args: Args,
): void
// implementation
export function useUniversalDispatch<Args extends any[], A extends Action>(
  dispatch: Dispatch,
  action: (...args: Args) => ThunkAction<() => void, any, any, A>,
  args: Args,
) {
  if (isServer()) {
    dispatch(action(...args))
  }

  useEffect(() => {
    dispatch(action(...args))
  }, [dispatch, action, ...args])
}
