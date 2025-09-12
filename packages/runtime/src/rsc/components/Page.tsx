import { ComponentPropsWithoutRef } from 'react'
import { Page } from '../../next'
import { prerenderRSCNodes } from '../functions/prerender-rsc-nodes'
import { RSCNodesProvider } from '../context/RSCNodesProvider'

type Props = ComponentPropsWithoutRef<typeof Page>

export function RscPage(props: Props) {
  const rscNodes = prerenderRSCNodes(props.snapshot.document.data)

  console.log('rscNodes', rscNodes)

  return (
    <RSCNodesProvider value={rscNodes}>
      <Page {...props} />
    </RSCNodesProvider>
  )
}
