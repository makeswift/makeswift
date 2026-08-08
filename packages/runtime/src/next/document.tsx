'use client'

import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import {
  createMakeswiftStylesRegistry,
  RootStyleProps,
  RootStyleRegistry,
  StylesRegistry,
} from '../unstable-framework-support'
import { PropsWithChildren, useContext } from 'react'
import { StylesContext } from '../runtimes/react/css-runtime/components/styles-context-provider'

export class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage
    const stylesRegistry = createMakeswiftStylesRegistry()

    /*
      This runs only on the server and configures a `RootStyleRegistry` which disables
      rendering Makeswift-generated `<style>`s alongside components, opting instead to
      pull them from the styles registry and place them in the `<head>` manually.
      This is a special case for pages router, where React hoisting will not work during
      SSR.

      `InnerRootStyleRegistry` is a wrapper component that pulls in user configuration
      from the outer (userland) `RootStyleRegistry`. This would matter, for example, if
      the `RootStyleRegistry` in userland was configured with a custom class name prefix.
    */
    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceComponent: Component => props => (
          <InnerRootStyleRegistry stylesRegistry={stylesRegistry}>
            <Component {...props}></Component>
          </InnerRootStyleRegistry>
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

function InnerRootStyleRegistry({
  children,
  stylesRegistry,
}: PropsWithChildren<{
  stylesRegistry: StylesRegistry
}>) {
  const outerStylesContext = useContext(StylesContext)

  const outerStylesProps: RootStyleProps = {
    classNamePrefix: outerStylesContext?.classNamePrefix,
    enableCssReset: outerStylesContext?.enableCssReset,
  }

  return (
    <RootStyleRegistry
      {...outerStylesProps}
      stylesRegistry={stylesRegistry}
      shouldRenderStyleElements={false}
    >
      {children}
    </RootStyleRegistry>
  )
}
