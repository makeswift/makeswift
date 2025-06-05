import { unstructuredIntrospection } from './unstructured-introspection'
import * as Introspection from './__fixtures__'

describe('Unstructured Introspection', () => {
  test('identifies and returns IDs for resource types relevant to cross-site resource copy/paste', () => {
    const introspectedResourceIds = unstructuredIntrospection(
      Introspection.elementContainingResources,
    )
    expect(introspectedResourceIds).toMatchSnapshot('Resources relevant to cross-site copy/paste')
  })
})
