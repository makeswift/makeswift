import { runtime } from '@/makeswift/runtime'
import { transformSchemaToControls } from '@/lib/schema-transformer'
import { createTransformer } from './transformer-factory'

import WidgetTemplates from '@/lib/widget-templates.json'

for (const widgetTemplate of WidgetTemplates) {
  // @ts-expect-error
  const controls = transformSchemaToControls(widgetTemplate)
  const Transformer = createTransformer(widgetTemplate)

  runtime.registerComponent(Transformer, {
    type: widgetTemplate.kind,
    label: 'Widget / ' + widgetTemplate.name,
    props: controls,
    server: true,
  })
}
