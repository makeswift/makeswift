'server-only'

import { type ReactElement } from 'react'
import { renderTemplate } from '@/lib/template-renderer'
import { createWidgetContext } from '@/lib/widget-context'
import WidgetTemplates from '@/lib/widget-templates.json'
import parse from 'html-react-parser'

type WidgetTemplate = (typeof WidgetTemplates)[number]

export function createTransformer(widgetTemplate: WidgetTemplate) {
  return async function Transformer(props: any): Promise<ReactElement> {
    const queryVariables = {
      productId: Number(props.productId || 111),
      productIds: props.productIds?.map(Number) || [107, 104],
      activeCurrencyCode: props.currency || 'USD',
    }

    const context = await createWidgetContext(
      widgetTemplate.kind,
      props,
      // @ts-expect-error
      widgetTemplate,
      queryVariables,
    )

    // Render the Handlebars template with the context
    const html = await renderTemplate(widgetTemplate.template, context)

    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }
}
