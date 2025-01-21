import { Component } from '@/lib/makeswift'

import { COMPONENT_TYPE } from './register'

type Props = {
  snapshotId?: string
  label?: string
}

export const SiteFooter = async ({ snapshotId = 'site-footer', label = 'Site Footer' }: Props) => {
  return <Component label={label} snapshotId={snapshotId} type={COMPONENT_TYPE} />
}
