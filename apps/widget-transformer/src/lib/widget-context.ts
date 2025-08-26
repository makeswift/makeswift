import { BigCommerceWidgetSchema } from './schema-transformer'

/**
 * Create BigCommerce widget context from props and schema defaults
 */
export function createWidgetContext(
  widgetId: string,
  props: Record<string, any>,
  widgetSchema: BigCommerceWidgetSchema,
) {
  const context: any = {
    _: {
      id: widgetId,
      context: {
        isEditorMode: false,
      },
      pageBuilderData: {
        previewState: {
          editMode: false,
        },
      },
    },
  }

  function extractDefaults(
    settings: Array<{
      id: string
      type?: string
      default?: any
      settings?: any[]
    }>,
  ) {
    settings.forEach((setting) => {
      if (setting.type === 'hidden' && setting.settings) {
        // Handle hidden settings with nested settings
        setting.settings.forEach((hiddenSetting: any) => {
          context[hiddenSetting.id] =
            props[hiddenSetting.id] ?? hiddenSetting.default
        })
      } else if (setting.id) {
        context[setting.id] = props[setting.id] ?? setting.default
      }
    })
  }

  widgetSchema.schema.forEach((section) => {
    if (section.settings) {
      extractDefaults(section.settings)
    }
    if (section.sections) {
      section.sections.forEach((subsection) => {
        if (subsection.settings) {
          extractDefaults(subsection.settings as any)
        }
      })
    }
  })

  return context
}
