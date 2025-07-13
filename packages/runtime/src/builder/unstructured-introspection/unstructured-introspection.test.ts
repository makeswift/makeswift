import { unstructuredIntrospection } from './unstructured-introspection'
import * as Introspection from './__fixtures__'

describe('Unstructured Introspection', () => {
  test('identifies and returns IDs for resource types relevant to cross-site resource copy/paste', () => {
    const introspectedResourceIds = unstructuredIntrospection(
      Introspection.elementContainingResources,
    )
    expect(introspectedResourceIds).toMatchSnapshot('Resources relevant to cross-site copy/paste')
  })
  test('recognizes node ID that has colons in its value', () => {
    const typeName = 'Swatch'
    const value = 'a:b::c'
    const nodeId = Buffer.from(`${typeName}:${value}`).toString('base64')
    const element = {
      key: '00000000-0000-0000-0000-000000000000',
      props: {
        testProp: {
          swatchId: nodeId,
        },
      },
      type: 'test',
    }
    const introspectedResourceIds = unstructuredIntrospection(element)
    expect(Array.from(introspectedResourceIds.swatchIds)).toEqual([nodeId])
  })
})
