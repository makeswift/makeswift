import HandlebarsRenderer from '@bigcommerce/stencil-paper-handlebars'

// Initialize the HandlebarsRenderer with BigCommerce settings
const renderer = new HandlebarsRenderer(
  {}, // siteSettings
  {}, // themeSettings
  'v3', // handlebars version
  console, // logger
  'info', // log level
)

export interface TemplateContext {
  _: {
    id: string
    pageBuilderData?: {
      previewState?: {
        editMode: boolean
      }
    }
    context?: {
      isEditorMode: boolean
    }
  }
  [key: string]: any
}

export async function renderTemplate(
  template: string,
  context: TemplateContext,
): Promise<string> {
  try {
    return await renderer.renderString(template, context)
  } catch (error) {
    console.error('Template rendering error:', error)
    return '<div>Error rendering template</div>'
  }
}

