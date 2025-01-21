import { Component } from '@/lib/makeswift'

import { COMPONENT_TYPE } from './register'

type Props = {
  snapshotId?: string
  label?: string
}

export const SiteHeader = async ({ snapshotId = 'site-header', label = 'Site Header' }: Props) => {
  return <Component label={label} snapshotId={snapshotId} type={COMPONENT_TYPE} />
}
