import { renderTemplate, createDefaultContext } from '@/lib/template-renderer'
import buttonWidgetTemplate from '@/lib/button-widget-template.json'
import { PropsContextProvider } from './client'
import { MakeswiftComponent } from '@makeswift/runtime/next'
import { generateEmptyComponentSnapshot } from '@/makeswift/utils'
import { ButtonKind } from './register'

export async function Transformer() {
  // Render the template on the server with BigCommerce helpers
  const context = createDefaultContext('button-widget-123')
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
