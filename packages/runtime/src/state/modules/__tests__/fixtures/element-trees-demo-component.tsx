import { type ReactNode } from 'react'

export const ELEMENT_TREE_DEMO_COMPONENT_TYPE = 'Demo'

export function ElementTreesDemo({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
