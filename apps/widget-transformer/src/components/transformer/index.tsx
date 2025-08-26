import { renderTemplate } from '@/lib/template-renderer'
import { createWidgetContext } from '@/lib/schema-transformer'
import { PropsContextProvider } from './client'
import { MakeswiftComponent } from '@makeswift/runtime/next'
import { client } from '@/makeswift/client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { resolveProps } from '@/makeswift/prop-resolution'
import WidgetTemplates from '@/lib/widget-templates.json'

type Props = {
  widgetTemplate: (typeof WidgetTemplates)[number]
}

export async function Transformer({ widgetTemplate }: Props) {
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
