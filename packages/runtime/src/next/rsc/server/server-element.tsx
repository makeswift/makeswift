import { ReactNode } from 'react'
import {
  isElementReference,
  type Element as ElementDataOrRef,
} from '../../../state/read-only-state'
import { ServerElementData } from './server-element-data'
import { getRuntime, getSiteVersionFromCache } from './runtime'
import { Element } from '../../../runtimes/react'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { RSCBuilderUpdater } from '../client/rsc-builder-updater'

type Props = {
  element: ElementDataOrRef
  resolvedProps: Record<string, unknown> | null
}

export function ServerElement({ element, resolvedProps }: Props): ReactNode {
  const state = getRuntime().protoStore.getState()
  const elementMeta = state.componentsMeta.get(element.type)

  if (elementMeta == null) {
    return <FallbackComponent text="Component not found" />
  }

  const isRSC = elementMeta.server ?? false

  if (!isRSC) {
    return <Element key={element.key} element={element} />
  }

  if (isElementReference(element)) {
    return <FallbackComponent text="Element reference is not supported on server yet" />
  }

  if (resolvedProps == null) {
    return <FallbackComponent text={`Props not resolved for ${element.type}`} />
  }

  const siteVersion = getSiteVersionFromCache()
  const isPreview = siteVersion != null

  if (isPreview) {
    return (
      <RSCBuilderUpdater initialElementData={element}>
        <ServerElementData key={element.key} elementData={element} resolvedProps={resolvedProps} />
      </RSCBuilderUpdater>
    )
  }

  return <ServerElementData key={element.key} elementData={element} resolvedProps={resolvedProps} />
}
