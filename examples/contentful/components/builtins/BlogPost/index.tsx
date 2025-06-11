import { Component } from '@/lib/makeswift/component'

import { COMPONENT_TYPE } from './register'

export async function BlogPost({ id, label }: { id: string; label: string }) {
  return <Component label={label} snapshotId={id} type={COMPONENT_TYPE} />
}
