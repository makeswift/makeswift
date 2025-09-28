import { ComponentPropsWithoutRef } from 'react'
import { Page } from '../..'
import { prerenderRSCNodes } from '../functions/prerender-rsc-nodes'
import { RSCNodesProvider } from '../context/rsc-nodes'
import { CSSInjector } from '../css/css-collector'
import { RSCStyleProvider } from '../css/style-runtime'

type Props = ComponentPropsWithoutRef<typeof Page>

export function NextRSCMakeswiftPage(props: Props) {
  const rscNodes = prerenderRSCNodes(props.snapshot.document.data)

  return (
    <RSCNodesProvider value={rscNodes}>
      <RSCStyleProvider>
        <CSSInjector />
        <Page {...props} />
      </RSCStyleProvider>
    </RSCNodesProvider>
  )
}
