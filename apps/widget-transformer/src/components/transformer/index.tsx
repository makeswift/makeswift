import { renderTemplate } from '@/lib/template-renderer'
import { PropsContextProvider } from './client'
import { MakeswiftComponent } from '@makeswift/runtime/next'
import { client } from '@/makeswift/client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { resolveProps } from '@/makeswift/prop-resolution'
import WidgetTemplates from '@/lib/widget-templates.json'
import { createWidgetContext } from '@/lib/widget-context'

type Props = {
  widgetTemplate: (typeof WidgetTemplates)[number]
}

export async function Transformer({ widgetTemplate }: Props) {
  // Debugging sd-product
  if (widgetTemplate.kind !== 'sd-product') return <></>

  const snapshot = await client.getComponentSnapshot(widgetTemplate.kind, {
    siteVersion: getSiteVersion(),
  })
  // @ts-expect-error
  const makeswiftProps = resolveProps(snapshot.document.data?.props ?? {})
  const context = createWidgetContext(
    widgetTemplate.kind,
    makeswiftProps,
    // @ts-expect-error
    widgetTemplate,
  )
  const html = await renderTemplate(widgetTemplate.template, context)

  return (
    <PropsContextProvider value={{ html }}>
      <MakeswiftComponent
        label={widgetTemplate.name}
        snapshot={snapshot}
        type={widgetTemplate.kind}
      />
    </PropsContextProvider>
  )
}
