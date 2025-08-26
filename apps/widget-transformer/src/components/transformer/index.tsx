import { renderTemplate } from '@/lib/template-renderer'
import { createWidgetContext } from '@/lib/schema-transformer'
import buttonWidgetTemplate from '@/lib/button-widget-template.json'
import { PropsContextProvider } from './client'
import { MakeswiftComponent } from '@makeswift/runtime/next'
import { generateEmptyComponentSnapshot } from '@/makeswift/utils'
import { ButtonKind } from './register'

interface TransformerProps {
  [key: string]: any
}

export async function Transformer(props: TransformerProps = {}) {
  // Generate context automatically from widget schema and props
  const context = createWidgetContext('button-widget-123', props, buttonWidgetTemplate)
  
  // Render the template on the server with BigCommerce helpers
  const html = await renderTemplate(buttonWidgetTemplate.template, context)

  return (
    <PropsContextProvider value={{ html }}>
      <MakeswiftComponent
        label={'Transformer'}
        snapshot={generateEmptyComponentSnapshot()}
        type={ButtonKind}
      />
    </PropsContextProvider>
  )
}
