'use client'

import { type ReactNode, type PropsWithChildren, memo, lazy } from 'react'

import { type ControlInstanceKey } from '@makeswift/controls'

import { useIsReadOnly } from '../../hooks/use-is-read-only'

const EditableNodeValue = lazy(() => import('./editable-node-value'))
const ReadOnlyNodeValue = ({ children }: PropsWithChildren) => children

export const NodeValue = memo(function NodeValue({
  instanceKey,
  children,
}: PropsWithChildren<{ instanceKey: ControlInstanceKey | undefined }>): ReactNode {
  const NodeContainer = useIsReadOnly() ? ReadOnlyNodeValue : EditableNodeValue
  return <NodeContainer instanceKey={instanceKey}>{children}</NodeContainer>
})
