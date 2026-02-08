import * as ElementTrees from '../element-trees'
import * as Fixtures from './fixtures/element-trees'
import {
  ELEMENT_TREE_DEMO_COMPONENT_TYPE,
  ElementTreesDemo,
} from './fixtures/element-trees-demo-component'

import { createReactRuntime } from '../../../runtimes/react/testing/react-runtime'
import { getPropControllerDescriptors } from '../../read-only-state'
import { Slot } from '../../../controls'
import { createElementTree } from '../../actions/internal/read-only-actions'
import { changeElementTree } from '../../actions/internal/read-write-actions'

describe('traverseElementTree', () => {
  const runtime = createReactRuntime()

  test('walks the tree in the correct order', () => {
    const descriptors = getPropControllerDescriptors(runtime.store.getState())
    const elements = ElementTrees.traverseElementTree(Fixtures.homePage, descriptors)
    expect([...elements].map(({ key, type }) => ({ key, type }))).toMatchSnapshot()
  })
})

describe('getChangedElementsPaths', () => {
  test('gracefully handles empty path', () => {
    const changedPaths = ElementTrees.getChangedElementsPaths([])
    expect(changedPaths).toStrictEqual([{ elementPath: [], propName: null }])
  })

  describe('gracefully handles incorrect paths', () => {
    let consoleError: jest.SpyInstance
    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    })

    afterEach(() => {
      expect(console.error).toHaveBeenCalled()
      consoleError.mockRestore()
    })

    test.each([
      { path: [0] },
      { path: ['foo', 0] },
      { path: ['foo', 0, 'props'] },
      { path: ['props', 'background', 7] },
    ])('$path', ({ path }) => {
      expect(ElementTrees.getChangedElementsPaths(path)).toStrictEqual([
        { elementPath: [], propName: null },
      ])
    })

    test("['foo', 0, 'props', 'background']", () => {
      expect(ElementTrees.getChangedElementsPaths(['foo', 0, 'props', 'background'])).toStrictEqual(
        [
          { elementPath: ['foo', 0], propName: 'background' },
          { elementPath: [], propName: null },
        ],
      )
    })
  })

  test('correctly partitions operation path', () => {
    expect(ElementTrees.getChangedElementsPaths(['props', 'margin'])).toStrictEqual([
      { elementPath: [], propName: 'margin' },
    ])

    expect(ElementTrees.getChangedElementsPaths(['props', 'margin', 0, 'foo'])).toStrictEqual([
      { elementPath: [], propName: 'margin' },
    ])

    expect(
      ElementTrees.getChangedElementsPaths(['props', 'children', 'value', 'elements', 4, 'foo']),
    ).toStrictEqual([{ elementPath: [], propName: 'children' }])

    expect(
      ElementTrees.getChangedElementsPaths([
        'props',
        'columns',
        'value',
        'elements',
        4,
        'props',
        'foo',
      ]),
    ).toStrictEqual([
      { elementPath: ['props', 'columns', 'value', 'elements', 4], propName: 'foo' },
      { elementPath: [], propName: 'columns' },
    ])

    expect(
      ElementTrees.getChangedElementsPaths([
        'props',
        'children',
        'value',
        'elements',
        1,
        'props',
        'children',
        'value',
        'elements',
        0,
        'props',
        'children',
      ]),
    ).toStrictEqual([
      {
        elementPath: [
          'props',
          'children',
          'value',
          'elements',
          1,
          'props',
          'children',
          'value',
          'elements',
          0,
        ],
        propName: 'children',
      },
      { elementPath: ['props', 'children', 'value', 'elements', 1], propName: 'children' },
      { elementPath: [], propName: 'children' },
    ])
  })
})

describe('resetting an element tree', () => {
  const runtime = createReactRuntime()
  runtime.registerComponent(ElementTreesDemo, {
    type: ELEMENT_TREE_DEMO_COMPONENT_TYPE,
    label: 'Demo',
    props: {
      left: Slot(),
      right: Slot(),
    },
  })

  test('garbage collects all elements that were removed on reset', () => {
    const descriptors = getPropControllerDescriptors(runtime.store.getState())
    const documentKey = '0f567942-3ef5-4e66-abb0-969044145606'

    const oldDocument = {
      key: documentKey,
      rootElement: Fixtures.resetElementTree.beforeReset,
    }

    const initialState = ElementTrees.reducer(
      ElementTrees.getInitialState(),
      createElementTree({
        document: oldDocument,
        descriptors,
      }),
    )

    const initialElementKeys = Array.from(
      ElementTrees.getElements(initialState, documentKey).keys(),
    )
    expect(initialElementKeys).toMatchSnapshot()

    const newDocument = {
      key: documentKey,
      rootElement: Fixtures.resetElementTree.afterReset,
    }

    const resetOp = [{ p: [], od: oldDocument.rootElement, oi: newDocument.rootElement }]

    const updatedState = ElementTrees.reducer(
      initialState,
      changeElementTree({
        oldDocument,
        newDocument,
        descriptors,
        operation: resetOp,
      }),
    )

    const elementKeysAfterReset = Array.from(
      ElementTrees.getElements(updatedState, documentKey).keys(),
    )
    expect(elementKeysAfterReset).toMatchSnapshot()

    // The before/after fixtures are composed of entirely unique elements, so
    // they should share no common keys
    expect(initialElementKeys.some(key => elementKeysAfterReset.includes(key))).toBe(false)
    expect(elementKeysAfterReset.some(key => initialElementKeys.includes(key))).toBe(false)
  })
})
