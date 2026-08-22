import { MakeswiftClient } from '../../../../../client'
import { type ServerRenderContext } from '../../render-context'

import { ServerElement } from '../element'

import { createReactRuntime } from '../../../testing'
import { renderToString } from '../../../testing/render-to-string'
import { SiteVersion } from '../../../../../next'

const elementKey = 'test-element-key'
const documentKey = 'test-document-key'
const componentType = 'TestComponent'

const TestComponent = ({ widgetId, documentId }: { widgetId: string; documentId: string }) => (
  <div data-widget-id={widgetId} data-document-id={documentId} />
)

describe('ServerElement', () => {
  const createFixture = ({
    siteVersion,
    locale,
  }: {
    siteVersion: SiteVersion | null
    locale?: string
  }) => {
    const runtime = createReactRuntime({
      env: 'rsc',
      requestKey: { siteVersion, locale },
    })

    runtime.registerComponent(TestComponent, {
      type: componentType,
      label: 'Test component',
      props: {},
      server: {
        unstable_injectedProps: {
          widgetId: 'elementKey',
          documentId: 'documentKey',
        },
      },
    })

    const renderContext: ServerRenderContext = {
      request: new Request('https://example.com'),
      runtime,
      client: new MakeswiftClient('test-api-key', { runtime }),
      siteVersion,
      locale,
      store: runtime.getOrCreateStore({ siteVersion, locale }),
    }

    return { renderContext }
  }

  test('injects configured values into component props', async () => {
    const { renderContext } = createFixture({ siteVersion: null })
    const element = {
      key: elementKey,
      type: componentType,
      props: {},
    }

    const html = await renderToString(
      <ServerElement context={renderContext} documentKey={documentKey} element={element} />,
    )

    expect(html).toEqual(
      `<div data-widget-id="${element.key}" data-document-id="${documentKey}"></div>`,
    )
  })
})
