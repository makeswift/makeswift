'use client'

import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { createMakeswiftStylesRegistry, RootStyleRegistry } from '../unstable-framework-support'

class PagesRouterDocument extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage
    const stylesRegistry = createMakeswiftStylesRegistry()

    /*
      This runs only on the server and configures a `RootStyleRegistry` which disables
      rendering Makeswift-generated `<style>`s alongside components, opting instead to
      pull them from the styles registry and place them in the `<head>` manually.
      This is a special case for pages router, where React hoisting will not work during
      SSR.
    */
    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceComponent: Component => props => (
          <RootStyleRegistry stylesRegistry={stylesRegistry} shouldRenderStyleElements={false}>
            <Component {...props}></Component>
          </RootStyleRegistry>
        ),
      })
    }

    const initialProps = await super.getInitialProps(ctx)
    const perPrecedenceStyleProps = stylesRegistry.serializeToStyleProps()
    const makeswiftStyleElements = perPrecedenceStyleProps.map(props => {
      return (
        <style key={props.precedence} data-href={props.href} data-precedence={props.precedence}>
          {props.css}
        </style>
      )
    })

    const combinedStyles = (
      <>
        {initialProps.styles}
        {makeswiftStyleElements}
      </>
    )

    return {
      ...initialProps,
      styles: combinedStyles,
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export const Document = PagesRouterDocument
