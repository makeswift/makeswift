/** @jest-environment jsdom */
import { createReactRuntime } from '../testing/react-runtime'

import { elementTree } from './__fixtures__/element-tree'

const runtime = createReactRuntime()

describe('copyElementTree', () => {
  test('creates a copy of the tree with no value replacements when context is empty', () => {
    const result = runtime.copyElementTree(elementTree, {})
    // can't do `expect(result).toEqual(elementTree)` here because we're regenerating rich text element keys
    expect(result).toMatchSnapshot('no replacements')
  })

  test('returns a copy of the tree with replaced IDs', () => {
    const result = runtime.copyElementTree(elementTree, {
      swatchIds: {
        'U3dhdGNoOjkzYTcxNjk1LWI5ZGEtNDExNC04NGM1LWMzYjBmM2RlY2U3NA==': '[replaced-swatch-id-1]',
        'U3dhdGNoOjJkN2FkYjMwLWNkZTItNDI2NS1hN2Q0LTY3ZTkzNTg2ODMxMg==': '[replaced-swatch-id-2]',
      },
      fileIds: {
        'RmlsZToxMDZjODJlNC03ZmEzLTQwOGQtYmVhNy04Zjk1N2IzMDlkZTY=': '[replaced-file-id-1]',
      },
      typographyIds: {
        'VHlwb2dyYXBoeToyYTk5ZTk2NS02OWIzLTQ0YjgtOTdkMS05MmM0ODM4YmUwZTc=':
          '[replaced-typography-id-1]',
      },
      pageIds: {
        'UGFnZTpmNTljNGNjNy1mZDhkLTRkZjUtYjM1Yi00NzFhOWViNWMyNjg=': '[replaced-page-id-1]',
      },
    })

    expect(result).toMatchSnapshot('replaced IDs')
  })
})
