declare module '@bigcommerce/stencil-paper-handlebars' {
  class HandlebarsRenderer {
    constructor(
      siteSettings: any,
      themeSettings: any,
      hbVersion: string,
      logger?: any,
      logLevel?: string
    )
    
    renderString(template: string, context: any): Promise<string>
  }
  
  export = HandlebarsRenderer
}

// Extended BigCommerce widget template with storefront_api_query support
export interface BigCommerceWidgetTemplate {
  uuid: string
  name: string
  kind: string
  template: string
  schema: any[]
  storefront_api_query?: string
  date_created: string
  date_modified: string
  icon_name: string
  template_engine: string
  client_rerender: boolean
  current_version_uuid: string
  channel_id: number
  schema_translations: Record<string, any>
}