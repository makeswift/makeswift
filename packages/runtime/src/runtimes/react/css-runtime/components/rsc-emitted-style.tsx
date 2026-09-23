'use client'

// import { useIsReadOnly } from '../../hooks/use-is-read-only'
import { useStylesContext } from '../hooks/use-styles-context'
import { ControlledStyleData } from '../types'
import { ControlledStyle } from './controlled-styles'

type Props = {
  namespace: string
  serializableData: Omit<ControlledStyleData, 'onBoxModelChange'>
}

/**
 * After crossing the RSC/client boundary, uses the subset of style data
 * which was able to cross that boundary to conditionally:
 *  - update the styles registry
 *  - render a `ControlledStyle`
 *
 * When in read-only mode, this is the only source which attempts to
 * render `ControlledStyle` for RSC props that uses style controls.
 *
 * When in read/write mode (in the builder), the editable server elements pathway
 * separately renders `ControlledStyle` for RSC props using prop data that
 * is resolved beyond the RSC/client boundary and therefore able to retain
 * unserializable properties that aren't available to `RSCEmittedStyle`.
 *
 * Attempting to write to the styles registry here when in read/write mode would
 * lead to a last-write-wins scenario involving RSC-emitted `serializableData` and
 * style data written by the editable server element pathway. Given that
 * `serializableData` becomes stale when dynamic style edits are made (since they
 * do not trigger re-rendering the RSC), this would visually break the editing
 * experience in cases where `RSCEmittedStyle` re-renders and writes stale style
 * data after the editable server element pathway.
 */
export function RSCEmittedStyle({ namespace, serializableData }: Props) {
  const { stylesRegistry } = useStylesContext()
  // const isReadOnly = useIsReadOnly()

  // Defer to the pathway for handling editable server elements, see note above
  // if (!isReadOnly) {
  //   return null
  // }

  stylesRegistry.setControlledStyle({
    namespace,
    className: serializableData.className,
    data: serializableData,
  })

  return <ControlledStyle className={serializableData.className} styleData={serializableData} />
}
