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
  const snapshot = await client.getComponentSnapshot(widgetTemplate.kind, {
    siteVersion: getSiteVersion(),
  })
  // @ts-expect-error
  const makeswiftProps = resolveProps(snapshot.document.data?.props ?? {})

  const queryVariables = {
    productId: Number(makeswiftProps.productId || 111),
    productIds: makeswiftProps.productIds?.map(Number) || [107, 104],
    activeCurrencyCode: makeswiftProps.currency || 'USD',
  }

  const context = await createWidgetContext(
    widgetTemplate.kind,
    makeswiftProps,
    // @ts-expect-error
    widgetTemplate,
    queryVariables,
  )

  // Render the Handlebars template with the context
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
