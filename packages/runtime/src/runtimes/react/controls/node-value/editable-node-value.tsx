import { type ReactNode, type PropsWithChildren } from 'react'

import { type ControlInstanceKey } from '@makeswift/controls'

import {
  useResolvedValueOverride,
  DisableResolvedValueOverride,
} from '../../hooks/use-resolved-value-override'

export const EditableNodeValue = ({
  instanceKey,
  children: value,
}: PropsWithChildren<{ instanceKey: ControlInstanceKey | undefined }>): ReactNode => {
  // To make ReactNode props that have been rendered by an RSC component editable purely
  // client-side, we store the edits in the read-write store as overrides and swap them
  // in when present
  const [valueOverride, shouldOverride] = useResolvedValueOverride(instanceKey)
  if (shouldOverride) {
    // disable the override for this instance while rendering it to prevent infinite recursion
    // (the override for a `Slot` prop is a `SlotValue`, which recursively renders another
    // instance of `EditableNodeValue`, which, if we don’t disable it, will find the override
    // and render it again, ad infinitum)
    return (
      <DisableResolvedValueOverride.Provider value={instanceKey}>
        {valueOverride as ReactNode}
      </DisableResolvedValueOverride.Provider>
    )
  }

  return value
}

export default EditableNodeValue
