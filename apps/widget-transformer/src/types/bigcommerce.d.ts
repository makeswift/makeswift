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