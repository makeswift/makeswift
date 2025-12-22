import { type ComponentPropsWithoutRef } from 'react'

import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { render } from '@testing-library/react'

import { ReactRuntime } from '../../runtimes/react/react-runtime'
import { MakeswiftComponentType } from '../../components/builtin/constants'

import { Page as MakeswiftPage } from '../components/page'

import { ReactProvider } from './react-provider'

export async function testMakeswiftPageHeadRendering(
  props: ComponentPropsWithoutRef<typeof MakeswiftPage>,
  { forcePagesRouter = false }: { forcePagesRouter?: boolean } = {},
) {
  const runtime = new ReactRuntime()

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
  const runtime = new ReactRuntime()

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
