import { ComponentPropsWithoutRef } from 'react'
import { Page } from '../../next'
import { prerenderRSCNodes } from '../functions/prerender-rsc-nodes'
import { RSCNodesProvider } from '../context/RSCNodesProvider'
import { CSSInjector } from '../css/css-collector'

type Props = ComponentPropsWithoutRef<typeof Page>

export function RscPage(props: Props) {
  const rscNodes = prerenderRSCNodes(props.snapshot.document.data)

  return (
    <RSCNodesProvider value={rscNodes}>
      {/* Automatically inject all RSC-generated CSS */}
      <CSSInjector />
      <Page {...props} />
    </RSCNodesProvider>
  )
}
