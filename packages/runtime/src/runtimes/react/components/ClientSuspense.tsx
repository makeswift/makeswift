import { ReactNode, Suspense } from 'react'
import { isServer } from '../../../utils/is-server'

type Props = {
  children: ReactNode
}

export function ClientSuspense({ children }: Props) {
  if (isServer()) return children

  return <Suspense>{children}</Suspense>
}
