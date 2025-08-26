import { runtime } from '@/makeswift/runtime'
import { transformSchemaToControls } from '@/lib/schema-transformer'
import buttonWidgetTemplate from '@/lib/button-widget-template.json'
import { MakeswiftTransformer } from './client'

export const ButtonKind = 'sd-simple-button-v2'

const controls = transformSchemaToControls(buttonWidgetTemplate)

runtime.registerComponent(MakeswiftTransformer, {
  type: ButtonKind,
  label: 'BigCommerce Button Widget',
  props: controls,
})
