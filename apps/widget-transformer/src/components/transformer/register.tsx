import { runtime } from '@/makeswift/runtime'
import { transformSchemaToControls } from '@/lib/schema-transformer'
import { MakeswiftTransformer } from './client'

import WidgetTemplates from '@/lib/widget-templates.json'

for (const widgetTemplate of WidgetTemplates) {
  // @ts-expect-error
  const controls = transformSchemaToControls(widgetTemplate)

  runtime.registerComponent(MakeswiftTransformer, {
    type: widgetTemplate.kind,
    label: widgetTemplate.name,
    props: controls,
  })
}
