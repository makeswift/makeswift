import { BigCommerceWidgetSchema } from './schema-transformer'
import { createStorefrontClient } from './storefront-client'

export interface StorefrontApiQueryData {
  storefrontApiQuery: string
  storefrontApiQueryParamsJson: string
  storefrontApiToken: string
}

/**
 * Create BigCommerce widget context from props and schema defaults
 */
export async function createWidgetContext(
  widgetId: string,
  props: Record<string, any>,
  widgetSchema: BigCommerceWidgetSchema & { storefront_api_query?: string },
  queryVariables: Record<string, any> = {},
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
      typeMeta?: any
    }>,
  ) {
    settings.forEach((setting) => {
      if (setting.type === 'hidden' && setting.settings) {
        // Handle hidden settings with nested settings
        setting.settings.forEach((hiddenSetting: any) => {
          context[hiddenSetting.id] =
            props[hiddenSetting.id] ?? hiddenSetting.default
        })
      } else if (setting.type === 'element' && setting.id) {
        // Handle element type settings with nested controls
        const elementDefaults: any = {}
        
        // Extract default visibility
        if (setting.typeMeta?.controls?.visibility?.default) {
          elementDefaults.visibility = setting.typeMeta.controls.visibility.default
        }
        
        // Extract advanced settings defaults
        if (setting.typeMeta?.controls?.advanced?.settings) {
          setting.typeMeta.controls.advanced.settings.forEach((advancedSetting: any) => {
            if (advancedSetting.id && advancedSetting.default !== undefined) {
              elementDefaults[advancedSetting.id] = advancedSetting.default
            }
          })
        }
        
        // Merge with existing props for this element
        context[setting.id] = {
          ...elementDefaults,
          ...(props[setting.id] || {}),
        }
      } else if (setting.id) {
        context[setting.id] = props[setting.id] ?? setting.default
      }
      
      // Recursively handle nested settings
      if (setting.settings) {
        extractDefaults(setting.settings as any)
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

  // Handle storefront API query if present
  if (widgetSchema.storefront_api_query) {
    const storefrontClient = createStorefrontClient()

    if (storefrontClient && queryVariables) {
      try {
        // Fetch data server-side and inject into _.data
        const storefrontData = await storefrontClient.query(
          widgetSchema.storefront_api_query,
          queryVariables,
        )
        context._.data = storefrontData
      } catch (error) {
        console.error('Failed to fetch storefront data server-side:', error)
        // Provide query data for client-side fallback
        context._.queryData = {
          storefrontApiQuery: widgetSchema.storefront_api_query,
          storefrontApiQueryParamsJson: JSON.stringify(queryVariables),
          storefrontApiToken: process.env.STOREFRONT_API_TOKEN || '',
        }
      }
    } else {
      // No client available, provide query data for client-side execution
      context._.queryData = {
        storefrontApiQuery: widgetSchema.storefront_api_query,
        storefrontApiQueryParamsJson: JSON.stringify(queryVariables),
        storefrontApiToken: process.env.STOREFRONT_API_TOKEN || '',
      }
    }
  }

  return context
}
