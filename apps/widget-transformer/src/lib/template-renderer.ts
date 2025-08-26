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

export function createDefaultContext(id: string): TemplateContext {
  return {
    _: {
      id,
      pageBuilderData: {
        previewState: {
          editMode: false,
        },
      },
      context: {
        isEditorMode: false,
      },
    },
    // Widget settings with defaults from schema
    buttonText: 'Click Me',
    buttonLink: 'https://example.com',
    alignment: {
      horizontal: 'center',
    },
    buttonMargin: {
      top: { value: '0', type: 'px' },
      right: { value: '0', type: 'px' },
      bottom: { value: '0', type: 'px' },
      left: { value: '0', type: 'px' },
    },
    buttonPadding: {
      top: { value: '8', type: 'px' },
      right: { value: '24', type: 'px' },
      bottom: { value: '8', type: 'px' },
      left: { value: '24', type: 'px' },
    },
    fontFamily: 'Arial, sans-serif',
    fontWeight: '400',
    textSize: { value: 21, type: 'px' },
    textColor: '#FFFFFF',
    textColorHover: '#FFFFFF',
    backgroundColor: '#444444',
    backgroundColorHover: '#666666',
    borderColor: '#444444',
    borderColorHover: '#666666',
    buttonBorder: 1,
    borderRadius: 4,
  }
}
