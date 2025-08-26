import { TextInput, Color, Number, Select, Checkbox, Link } from '@makeswift/runtime/controls'

interface BigCommerceSchemaItem {
  type: string
  id?: string
  label?: string
  default?: any
  typeMeta?: any
  settings?: Array<{
    id: string
    default?: any
    type?: string
    label?: string
  }>
}

interface BigCommerceWidgetSchema {
  schema: Array<{
    type: string
    label?: string
    sections?: Array<{
      label: string
      settings: BigCommerceSchemaItem[]
    }>
    settings?: Array<{
      id: string
      default?: any
      type?: string
      label?: string
    }>
  }>
  [key: string]: any
}

/**
 * Transform BigCommerce widget schema to Makeswift controls
 */
export function transformSchemaToControls(widgetSchema: BigCommerceWidgetSchema) {
  const controls: Record<string, any> = {}

  function processSettings(settings: Array<{ id: string; type?: string; label?: string; default?: any; typeMeta?: any; settings?: any[] }>) {
    settings.forEach(setting => {
      if (setting.type === 'hidden') return
      if (!setting.id) return

      switch (setting.type) {
        case 'input':
          if (setting.typeMeta?.placeholder?.includes('http')) {
            controls[setting.id] = Link({ 
              label: setting.label || setting.id,
              ...(setting.default && { defaultValue: setting.default })
            })
          } else {
            controls[setting.id] = TextInput({ 
              label: setting.label || setting.id,
              ...(setting.default && { defaultValue: setting.default })
            })
          }
          break

        case 'color':
          controls[setting.id] = Color({ 
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default })
          })
          break

        case 'number':
          controls[setting.id] = Number({ 
            label: setting.label || setting.id,
            ...(setting.default?.value && { defaultValue: setting.default.value }),
            ...(setting.typeMeta?.min && { min: setting.typeMeta.min }),
            ...(setting.typeMeta?.max && { max: setting.typeMeta.max })
          })
          break

        case 'range':
          controls[setting.id] = Number({ 
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default }),
            ...(setting.typeMeta?.rangeValues?.min && { min: setting.typeMeta.rangeValues.min }),
            ...(setting.typeMeta?.rangeValues?.max && { max: setting.typeMeta.rangeValues.max })
          })
          break

        case 'select':
          if (setting.typeMeta?.selectOptions) {
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: setting.typeMeta.selectOptions.map((option: any) => ({
                label: option.label,
                value: option.value
              })),
              ...(setting.default && { defaultValue: setting.default })
            })
          }
          break

        case 'checkbox':
          controls[setting.id] = Checkbox({ 
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: setting.default })
          })
          break

        case 'alignment':
          if (setting.typeMeta?.display === 'horizontal') {
            controls[setting.id] = Select({
              label: setting.label || setting.id,
              options: [
                { label: 'Left', value: { horizontal: 'left' } },
                { label: 'Center', value: { horizontal: 'center' } },
                { label: 'Right', value: { horizontal: 'right' } }
              ],
              ...(setting.default && { defaultValue: setting.default })
            })
          }
          break

        default:
          // For unsupported types, default to text
          controls[setting.id] = TextInput({ 
            label: setting.label || setting.id,
            ...(setting.default && { defaultValue: String(setting.default) })
          })
      }
    })
  }

  widgetSchema.schema.forEach(section => {
    if (section.settings) {
      processSettings(section.settings)
    }
    if (section.sections) {
      section.sections.forEach(subsection => {
        if (subsection.settings) {
          processSettings(subsection.settings as any)
        }
      })
    }
  })

  return controls
}

/**
 * Create BigCommerce widget context from props and schema defaults
 */
export function createWidgetContext(
  widgetId: string,
  props: Record<string, any>,
  widgetSchema: BigCommerceWidgetSchema
) {
  const context: any = {
    _: {
      id: widgetId,
      context: {
        isEditorMode: false
      },
      pageBuilderData: {
        previewState: {
          editMode: false
        }
      }
    }
  }

  function extractDefaults(settings: Array<{ id: string; type?: string; default?: any; settings?: any[] }>) {
    settings.forEach(setting => {
      if (setting.type === 'hidden' && setting.settings) {
        // Handle hidden settings with nested settings
        setting.settings.forEach((hiddenSetting: any) => {
          context[hiddenSetting.id] = props[hiddenSetting.id] ?? hiddenSetting.default
        })
      } else if (setting.id) {
        context[setting.id] = props[setting.id] ?? setting.default
      }
    })
  }

  widgetSchema.schema.forEach(section => {
    if (section.settings) {
      extractDefaults(section.settings)
    }
    if (section.sections) {
      section.sections.forEach(subsection => {
        if (subsection.settings) {
          extractDefaults(subsection.settings as any)
        }
      })
    }
  })

  return context
}

/**
 * Get all context variables needed for the widget template
 */
export function extractContextVariables(widgetSchema: BigCommerceWidgetSchema): string[] {
  const variables: string[] = []

  function processSettings(settings: Array<{ id: string; type?: string; settings?: any[] }>) {
    settings.forEach(setting => {
      if (setting.type === 'hidden' && setting.settings) {
        setting.settings.forEach((hiddenSetting: any) => {
          variables.push(hiddenSetting.id)
        })
      } else if (setting.id) {
        variables.push(setting.id)
      }
    })
  }

  widgetSchema.schema.forEach(section => {
    if (section.settings) {
      processSettings(section.settings)
    }
    if (section.sections) {
      section.sections.forEach(subsection => {
        if (subsection.settings) {
          processSettings(subsection.settings as any)
        }
      })
    }
  })

  return variables
}