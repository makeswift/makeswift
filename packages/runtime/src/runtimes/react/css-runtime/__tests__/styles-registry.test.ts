import { StylesRegistry } from '../styles-registry'
import { ControlledStyleData, OnControlledStyleDataWrite } from '../types'
import { drainMicrotaskQueue } from './utils'

describe('styles registry', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  test('notifies listeners on controlled style writes', async () => {
    const stylesRegistry = new StylesRegistry()
    const listenerA: OnControlledStyleDataWrite = jest.fn()
    const listenerB: OnControlledStyleDataWrite = jest.fn()
    const registryNotifyListenersSpy = jest.spyOn(stylesRegistry, 'notifyOnControlledStyleWrite')

    stylesRegistry.subscribeToControlledStyleWrites(listenerA)
    stylesRegistry.subscribeToControlledStyleWrites(listenerB)

    const namespace = 'namespace'
    const className = 'my-class'
    const firstData: ControlledStyleData = {
      className,
      css: 'css-1',
      cssObject: {},
      contentHash: 'content-hash-1',
      elementKey: 'element-key',
      joinedPropPath: 'path-to-prop',
    }
    const secondData: ControlledStyleData = {
      className,
      css: 'css-2',
      cssObject: {},
      contentHash: 'content-hash-2',
      elementKey: 'element-key',
      joinedPropPath: 'path-to-prop',
    }

    // First write

    stylesRegistry.setControlledStyle({
      namespace,
      className,
      data: firstData,
    })

    expect(registryNotifyListenersSpy).toHaveBeenCalledTimes(1)

    await drainMicrotaskQueue()
    expect(listenerA).toHaveBeenCalledTimes(1)
    expect(listenerB).toHaveBeenCalledTimes(1)

    expect(listenerA).toHaveBeenCalledWith({
      className,
      currentData: firstData,
      initialData: firstData,
    })
    expect(listenerB).toHaveBeenCalledWith({
      className,
      currentData: firstData,
      initialData: firstData,
    })

    // Second write

    stylesRegistry.setControlledStyle({
      namespace,
      className,
      data: secondData,
    })
    expect(registryNotifyListenersSpy).toHaveBeenCalledTimes(2)

    await drainMicrotaskQueue()
    expect(listenerA).toHaveBeenCalledTimes(2)
    expect(listenerB).toHaveBeenCalledTimes(2)

    expect(listenerA).toHaveBeenCalledWith({
      className,
      currentData: secondData,
      initialData: firstData,
    })
    expect(listenerB).toHaveBeenCalledWith({
      className,
      currentData: secondData,
      initialData: firstData,
    })
  })
  describe('serialization', () => {
    let stylesRegistry: StylesRegistry
    beforeAll(() => {
      stylesRegistry = new StylesRegistry()
      stylesRegistry.setBaseStyles({
        css: 'a',
        contentHash: 'a',
        cssObject: {},
      })
      stylesRegistry.setCssReset({
        css: 'b',
        contentHash: 'b',
        cssObjects: [{}],
      })
      stylesRegistry.setKeyframes({
        keyframesName: 'c',
        css: 'c',
      })
    })
    test('to: stringified HTML style elements ordered by precedence', () => {
      const serializationResult = stylesRegistry.serializeToHtmlStyleTags()
      expect(serializationResult).toMatchSnapshot()
    })
    test('to: props ordered by precedence', () => {
      const propsResult = stylesRegistry.serializeToStyleProps()
      expect(propsResult).toMatchSnapshot()
    })
  })
})
