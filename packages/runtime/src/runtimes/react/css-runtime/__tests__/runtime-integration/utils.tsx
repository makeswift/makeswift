import { ComponentProps, ReactNode } from 'react'
import { ReactRuntime } from '../../../react-runtime'
import { SiteVersion } from '../../../../../api/site-version'
import { StylesRegistry } from '../../styles-registry'
import { RuntimeProvider } from '../../../components/RuntimeProvider'
import { RootStyleRegistry } from '../../../root-style-registry'
import {
  ControlDefinition,
  DataType,
  ElementData,
  StyleDefinition as StyleV1Definition,
  StyleV2Definition,
} from '@makeswift/controls'
import { createReactRuntime } from '../../../testing'
import {
  createMakeswiftPageSnapshot,
  createRootComponent,
} from '../../../../../testing/element-data'
import { Page } from '../../../components/page'
import { type CSSObject } from '@emotion/serialize'
import { createMakeswiftStylesRegistry } from '../../utils'
import { APIResource, APIResourceType } from '../../../../../api/types'
import { server } from '../../../../../mocks/server'
import { http, HttpResponse } from 'msw'

export type RuntimeIntegrationTestFixture = {
  runtime: ReactRuntime
  siteVersion: SiteVersion
  render: () => ReactNode
  domElementId: string
  stylesRegistry: StylesRegistry
  namespace: string
}

export function createControlledStylesTestFixtures({
  siteVersion,
  controlDefinition,
  sampleData,
}: {
  siteVersion: SiteVersion
  controlDefinition: StyleV1Definition | StyleV2Definition<ControlDefinition, CSSObject>
  sampleData:
    | DataType<StyleV1Definition>
    | DataType<StyleV2Definition<ControlDefinition, CSSObject>>
}): RuntimeIntegrationTestFixture {
  const customComponentType = 'test-component-type'
  const domElementId = 'dom-element-test-id'
  const CustomComponent = ({ className }: { className: string }) => {
    return (
      <div className={className} data-testid={domElementId}>
        Controlled styles applied to this div
      </div>
    )
  }
  const registrationFn = (runtime: ReactRuntime) => {
    runtime.registerComponent(CustomComponent, {
      type: customComponentType,
      label: 'Test Component',
      props: {
        className: controlDefinition,
      },
    })
  }
  const rootId = '00000000-0000-0000-0000-000000000000'
  const elementKey = '11111111-1111-1111-1111-111111111111'
  const elementData: ElementData = {
    key: elementKey,
    type: customComponentType,
    props: {
      className: sampleData,
    },
  }
  const rootElement = createRootComponent([elementData], rootId)
  const pageSnapshot = createMakeswiftPageSnapshot(rootElement)
  const makeswiftPageComponent = <Page snapshot={pageSnapshot} />

  const { runtime, renderElementTree, stylesRegistry } = setup({
    siteVersion,
    registrationFns: [registrationFn],
  })
  const render = () => {
    return renderElementTree(makeswiftPageComponent)
  }

  return {
    siteVersion,
    runtime,
    render,
    domElementId,
    stylesRegistry,
    namespace: elementKey,
  }
}

function setup({
  siteVersion,
  registrationFns,
}: {
  siteVersion: SiteVersion
  registrationFns: Array<(runtime: ReactRuntime) => void>
}) {
  const runtime = createReactRuntime()
  const stylesRegistry = createMakeswiftStylesRegistry()
  for (const registrationFn of registrationFns) {
    registrationFn(runtime)
  }
  const runtimeProviderProps: Omit<ComponentProps<typeof RuntimeProvider>, 'children'> = {
    runtime,
    siteVersion,
  }
  const rootStyleRegistryProps: Omit<ComponentProps<typeof RootStyleRegistry>, 'children'> = {
    stylesRegistry,
  }
  const renderElementTree = (component: ReactNode) => (
    <TestProviders
      runtimeProviderProps={runtimeProviderProps}
      rootStyleRegistryProps={rootStyleRegistryProps}
    >
      {component}
    </TestProviders>
  )
  return {
    runtime,
    renderElementTree,
    stylesRegistry,
    siteVersion,
  }
}

function TestProviders({
  runtimeProviderProps,
  rootStyleRegistryProps,
  children,
}: {
  runtimeProviderProps: Omit<ComponentProps<typeof RuntimeProvider>, 'children'>
  rootStyleRegistryProps: Omit<ComponentProps<typeof RootStyleRegistry>, 'children'>
  children: React.ReactNode
}) {
  return (
    <RuntimeProvider {...runtimeProviderProps}>
      <RootStyleRegistry {...rootStyleRegistryProps}>{children}</RootStyleRegistry>
    </RuntimeProvider>
  )
}

export function mockApiResourceRequests({ resources }: { resources: APIResource[] }) {
  if (resources.length > 0) {
    const swatchesBaseUrl = `/api/makeswift/swatches`
    for (const resource of resources) {
      if (resource.__typename === APIResourceType.Swatch) {
        server.use(
          http.get(`${swatchesBaseUrl}/${resource.id}`, () =>
            HttpResponse.json(resource, { status: 200 }),
          ),
        )
      } else {
        throw new Error(
          `Test data included a resource type that isn't handled with a mock: ${resource.__typename}`,
        )
      }
    }
  }
}
