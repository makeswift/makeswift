import { renderTemplate } from '@/lib/template-renderer'
import { createWidgetContext } from '@/lib/schema-transformer'
import buttonWidgetTemplate from '@/lib/button-widget-template.json'
import { PropsContextProvider } from './client'
import { MakeswiftComponent } from '@makeswift/runtime/next'
import { ButtonKind } from './register'
import { client } from '@/makeswift/client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { resolveProps } from '@/makeswift/prop-resolution'

interface TransformerProps {
  [key: string]: any
}

export async function Transformer(_props: TransformerProps = {}) {
  const snapshot = await client.getComponentSnapshot('button', {
    siteVersion: getSiteVersion(),
  })
  // @ts-expect-error
  const props = resolveProps(snapshot.document.data.props)
  const context = createWidgetContext('button', props, buttonWidgetTemplate)
  const html = await renderTemplate(buttonWidgetTemplate.template, context)

  return (
    <PropsContextProvider value={{ html }}>
      <MakeswiftComponent
        label={'Transformer'}
        snapshot={snapshot}
        type={ButtonKind}
      />
    </PropsContextProvider>
  )
}
