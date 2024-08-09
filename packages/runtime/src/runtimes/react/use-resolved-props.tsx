import { useMemo, useEffect, useSyncExternalStore } from 'react'
import { ControlInstance, type ResourceResolver } from '@makeswift/controls'

import * as ReactPage from '../../state/react-page'

import { useEffectorFactory } from './use-effector'

import { type Descriptor } from '../../prop-controllers/descriptors'
import { createPropsValuesSubscription } from './props-subscription'

export const useResolvedProps = (
  propDefs: Record<string, Descriptor>,
  controls: Record<string, ControlInstance> | null,
  elementData: Record<string, ReactPage.ElementData>,
  resourceResolver: ResourceResolver,
): Record<string, unknown> => {
  const effectorFactory = useEffectorFactory()
  const propsSubscription = useMemo(
    () =>
      createPropsValuesSubscription(
        propDefs,
        controls,
        elementData,
        resourceResolver,
        effectorFactory,
      ),
    [propDefs, controls, elementData, resourceResolver, effectorFactory],
  )

  effectorFactory.useStyles() // FIXME: useSyncExternalStore

  useEffect(() => {
    propsSubscription.triggerResolve()
  })

  return useSyncExternalStore(
    propsSubscription.subscribe,
    propsSubscription.readStableValue,
    propsSubscription.readStableValue,
  )
}
