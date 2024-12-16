import { traverseElementTree, getChangedElementsPaths } from '../element-trees'
import { getPropControllerDescriptors } from '../../react-page'
import { ReactRuntime } from '../../../runtimes/react'

import * as Fixtures from './fixtures/element-trees'

const runtime = new ReactRuntime()

describe('traverseElementTree', () => {
  test('walks the tree in the correct order', () => {
    const descriptors = getPropControllerDescriptors(runtime.store.getState())
    const elements = traverseElementTree(Fixtures.homePage, descriptors)
    expect([...elements].map(({ key, type }) => ({ key, type }))).toMatchSnapshot()
  })
})

describe('getChangedElementsPaths', () => {
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
      { path: [] },
      { path: [0] },
      { path: ['foo', 0] },
      { path: ['foo', 0, 'props'] },
      { path: ['props', 'background', 7] },
    ])('$path', ({ path }) => {
      expect(getChangedElementsPaths(path)).toStrictEqual([
        { elementPath: [], propName: 'children' },
      ])
    })

    test("['foo', 0, 'props', 'background']", () => {
      expect(getChangedElementsPaths(['foo', 0, 'props', 'background'])).toStrictEqual([
        { elementPath: ['foo', 0], propName: 'background' },
        { elementPath: [], propName: 'children' },
      ])
    })
  })

  test('correctly partitions operation path', () => {
    expect(getChangedElementsPaths(['props', 'margin'])).toStrictEqual([
      { elementPath: [], propName: 'margin' },
    ])

    expect(getChangedElementsPaths(['props', 'margin', 0, 'foo'])).toStrictEqual([
      { elementPath: [], propName: 'margin' },
    ])

    expect(
      getChangedElementsPaths(['props', 'children', 'value', 'elements', 4, 'foo']),
    ).toStrictEqual([{ elementPath: [], propName: 'children' }])

    expect(
      getChangedElementsPaths(['props', 'columns', 'value', 'elements', 4, 'props', 'foo']),
    ).toStrictEqual([
      { elementPath: ['props', 'columns', 'value', 'elements', 4], propName: 'foo' },
      { elementPath: [], propName: 'columns' },
    ])

    expect(
      getChangedElementsPaths([
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
