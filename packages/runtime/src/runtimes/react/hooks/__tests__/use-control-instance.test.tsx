/** @jest-environment jsdom */

import { type PropsWithChildren, act } from 'react'

import '@testing-library/jest-dom'
import { renderHook } from '@testing-library/react'

import {
  ControlInstance,
  ResourceResolver,
  Stylesheet,
  type AnyControlInstance,
} from '@makeswift/controls'

import { ControlInstancesProvider } from '../../components/control-instances-context'
import { SlotControl, Slot, GroupControl, Group, TextInput, List } from '../../../../controls'

import { useControlInstance, getInstanceChainByPropPath } from '../use-control-instance'

const createFixtures = ({
  createInstances,
}: { createInstances?: () => Record<string, AnyControlInstance> } = {}) => {
  const elementKey = 'test-element-key'
  const instanceKey = { elementKey, propPath: 'group.nestedGroup.slot' }

  const groupProp = Group({
    props: {
      nestedGroup: Group({
        props: {
          title: TextInput(),
          slot: Slot(),
        },
      }),
    },
  })

  const instances = {
    group: groupProp.createInstance({
      instanceKey: { elementKey, propPath: 'group' },
      sendMessage: () => {},
    }),
  }

  const wrapper = ({ children }: PropsWithChildren) => {
    return (
      <ControlInstancesProvider
        value={{
          elementKey,
          instances: createInstances ? createInstances() : instances,
        }}
      >
        {children}
      </ControlInstancesProvider>
    )
  }

  return { elementKey, instanceKey, wrapper, instances }
}

describe('useControlInstance', () => {
  let consoleError: jest.SpyInstance
  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn())
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  describe("returns 'undefined' when no instance is found", () => {
    test('no instances', () => {
      const { instanceKey, wrapper } = createFixtures({ createInstances: () => ({}) })
      const { result } = renderHook(() => useControlInstance(instanceKey, SlotControl), { wrapper })

      expect(result.current).toBe(null)
      expect(consoleError).not.toHaveBeenCalled()
    })

    test('wrong property path key', () => {
      const { instanceKey, wrapper } = createFixtures()
      const { result } = renderHook(
        () => useControlInstance({ ...instanceKey, propPath: 'group.slot' }, SlotControl),
        {
          wrapper,
        },
      )

      expect(result.current).toBe(null)
      expect(consoleError).not.toHaveBeenCalled()
    })

    test('wrong element key', () => {
      const { instanceKey, wrapper } = createFixtures()
      const { result } = renderHook(
        () => useControlInstance({ ...instanceKey, elementKey: 'no-such-element' }, SlotControl),
        {
          wrapper,
        },
      )

      expect(result.current).toBe(null)
      expect(consoleError).not.toHaveBeenCalled()
    })
  })

  test('returns instance with the correct key', () => {
    const { instanceKey, wrapper } = createFixtures()
    const { result } = renderHook(() => useControlInstance(instanceKey, SlotControl), { wrapper })

    expect(result.current?.instanceKey).toStrictEqual(instanceKey)
    expect(consoleError).not.toHaveBeenCalled()
  })

  test('returns null, logs to the console when requested an instance of incorrect type', async () => {
    const { instanceKey, wrapper } = createFixtures()
    const { result } = renderHook(() => useControlInstance(instanceKey, GroupControl), { wrapper })

    expect(result.current).toBe(null)
    expect(consoleError).toHaveBeenCalledWith(
      "Unexpected control instance class: requested 'GroupControl', found 'SlotControl'",
      { instanceKey: { elementKey: 'test-element-key', propPath: 'group.nestedGroup.slot' } },
    )
  })

  test('returns null, logs to the console if found a instance with an instance key that does not match its record key', async () => {
    const { elementKey, wrapper } = createFixtures({
      createInstances: () => ({
        group: Group({ props: {} }).createInstance({
          instanceKey: { elementKey, propPath: 'other-group' },
          sendMessage: () => {},
        }),
      }),
    })

    const { result } = renderHook(
      () => useControlInstance({ elementKey, propPath: 'group' }, GroupControl),
      { wrapper },
    )

    expect(result.current).toBe(null)
    expect(consoleError).toHaveBeenCalledWith(
      'Mismatching control instance key: expected',
      { elementKey, propPath: 'group' },
      ' got',
      { elementKey, propPath: 'other-group' },
    )
  })

  describe('correctly handles nested lists', () => {
    const listFixtures = () => {
      const elementKey = 'test-element-key'
      const instanceKey = { elementKey, propPath: 'list.0.0.title' }

      const list = List({
        type: List({
          type: Group({
            props: {
              title: TextInput({}),
            },
          }),
        }),
      })

      const listData = list.toData([
        [{ title: 'item 1' }],
        [{ title: 'Item 2' }],
        [{ title: 'Item 3' }],
      ])

      const listInstance = list.createInstance({
        instanceKey: { elementKey, propPath: 'list' },
        sendMessage: () => {},
      })

      const stylesheet = {
        child: () => stylesheet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as Stylesheet

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resolver = {} as any as ResourceResolver

      const resolveValueContext = [resolver, stylesheet, listInstance] as const

      return {
        instanceKey,
        list,
        listData,
        listInstance,
        resolveValueContext,
      }
    }

    test('returns the nested instance once the list resolves its children', async () => {
      // List item instances are lazily created in a side effect as a part of the list prop resolution;
      // test that `useControlInstance` correctly picks up these child instances.
      const { instanceKey, list, listInstance, listData, resolveValueContext } = listFixtures()
      const { wrapper } = createFixtures({ createInstances: () => ({ list: listInstance }) })

      const { result } = renderHook(() => useControlInstance(instanceKey, ControlInstance), {
        wrapper,
      })

      expect(result.current).toBe(null)

      await act(async () => {
        const resolved = list.resolveValue(listData, ...resolveValueContext)
        await resolved.triggerResolve()
      })

      expect(result.current?.instanceKey).toStrictEqual(instanceKey)
      expect(consoleError).not.toHaveBeenCalled()
    })
  })
})

describe('getInstanceChainByPropPath', () => {
  test('returns correct instance chain for valid prop paths', () => {
    const { instances } = createFixtures()

    expect(getInstanceChainByPropPath(instances, 'group').length).toBe(1)
    expect(getInstanceChainByPropPath(instances, 'group')[0]?.propPath).toBe('group')

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup').length).toBe(2)
    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup')[0]?.propPath).toBe('group')
    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup')[1]?.propPath).toBe(
      'group.nestedGroup',
    )

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.title').length).toBe(3)
    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.title')[0]?.propPath).toBe(
      'group',
    )

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.title')[1]?.propPath).toBe(
      'group.nestedGroup',
    )

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.title')[2]?.propPath).toBe(
      'group.nestedGroup.title',
    )
  })

  test('returns partial instance chain for partially valid prop paths', () => {
    const { instances } = createFixtures()

    expect(getInstanceChainByPropPath(instances, 'group.0').length).toBe(2)
    expect(getInstanceChainByPropPath(instances, 'group.0')[0]?.propPath).toBe('group')
    expect(getInstanceChainByPropPath(instances, 'group.0')[1]).toBe(null)

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.nope.other').length).toBe(3)
    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.nope.other')[0]?.propPath).toBe(
      'group',
    )

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.nope.other')[1]?.propPath).toBe(
      'group.nestedGroup',
    )

    expect(getInstanceChainByPropPath(instances, 'group.nestedGroup.nope.other')[2]).toBe(null)
  })

  test.each(['', 'nestedGroup', 'hello.world', '0.1.2.3'])(
    'returns `[null]` for non-existent prop path "%s"',
    propPath => {
      const { instances } = createFixtures()
      expect(getInstanceChainByPropPath(instances, propPath)).toStrictEqual([null])
    },
  )
})
