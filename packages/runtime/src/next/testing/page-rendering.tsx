import { type ComponentPropsWithoutRef, act } from 'react'

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import { MakeswiftComponentType } from '../../components/builtin/constants'

import { Page as MakeswiftPage } from '../components/page'

import { ReactProvider } from './react-provider'
import { createReactRuntime } from './react-runtime'

export async function testMakeswiftPageHeadRendering(
  props: ComponentPropsWithoutRef<typeof MakeswiftPage>,
  { forcePagesRouter = false }: { forcePagesRouter?: boolean } = {},
) {
  const runtime = createReactRuntime()

  runtime.registerComponent(() => <></>, {
    type: MakeswiftComponentType.Root,
    label: 'Root',
    props: {},
  })

  return await act(async () =>
    render(
      <ReactProvider runtime={runtime} siteVersion={null} forcePagesRouter={forcePagesRouter}>
        <MakeswiftPage {...props} />
      </ReactProvider>,
      {
        container: document.body.appendChild(document.createElement('head')),
      },
    ),
  )
}

export async function testMakeswiftPageRendering(
  props: ComponentPropsWithoutRef<typeof MakeswiftPage>,
  { forcePagesRouter = false }: { forcePagesRouter?: boolean } = {},
) {
  const runtime = createReactRuntime()

  return await act(async () =>
    render(
      <ReactProvider runtime={runtime} siteVersion={null} forcePagesRouter={forcePagesRouter}>
        <MakeswiftPage {...props} />
      </ReactProvider>,
      {
        container: document.body.appendChild(document.createElement('div')),
      },
    ),
  )
}
