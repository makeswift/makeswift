import { Transformer } from '@/components/transformer'
import WidgetTemplates from '@/lib/widget-templates.json'

export default async function Page() {
  return (
    <>
      {WidgetTemplates.map((widgetTemplate) => (
        <Transformer
          key={widgetTemplate.uuid}
          widgetTemplate={widgetTemplate}
        />
      ))}
    </>
  )
}
