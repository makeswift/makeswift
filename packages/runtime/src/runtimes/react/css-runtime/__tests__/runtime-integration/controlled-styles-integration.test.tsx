/** @jest-environment jsdom */

import { screen, render as testLibraryRender } from '@testing-library/react'
import { styleV1Samples } from './__fixtures__/sample-stylev1-data'
import { createControlledStylesTestFixtures, mockApiResourceRequests } from './utils'
import { act } from 'react'
import assert from 'assert'
import { setBreakpoints } from '../../../../../state/builder-api/actions'
import { styleV2Samples } from './__fixtures__/sample-stylev2-data'
import { StyleElementUpdater } from '../../style-element-updater'
import { TestWorkingSiteVersion } from '../../../../../testing/fixtures/site-version'

describe('Controlled styles integration:', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  const testCases = [...styleV1Samples, ...styleV2Samples]

  test.each(testCases)('$description', async ({ sampleData, controlDefinition, resources }) => {
    const { runtime, stylesRegistry, render, domElementId, namespace } =
      createControlledStylesTestFixtures({
        siteVersion: TestWorkingSiteVersion,
        controlDefinition,
        sampleData,
      })
    const registrySubscribeSpy = jest.spyOn(stylesRegistry, 'subscribeToControlledStyleWrites')
    const registryNotifyListenersSpy = jest.spyOn(stylesRegistry, 'notifyOnControlledStyleWrite')
    const styleElementUpdaterSpy = jest.spyOn(StyleElementUpdater.prototype, 'apply')

    if (resources.length > 0) {
      mockApiResourceRequests({ resources })
    }
    const store = runtime.getOrCreateStore({
      siteVersion: TestWorkingSiteVersion,
      locale: undefined,
    })
    store.dispatch(setBreakpoints([{ id: 'desktop' }]))

    await act(async () => testLibraryRender(render()))

    const renderedElement = screen.getByTestId(domElementId)
    const resolvedClassName = renderedElement.className

    const styleElementsForClass = Array.from(
      document.querySelectorAll<HTMLStyleElement>(`style[data-href=${resolvedClassName}]`),
    )
    const styleElement = styleElementsForClass.length > 0 ? styleElementsForClass[0] : null
    const styleElementTextContent = styleElement?.textContent

    const controlledStylesByClass = stylesRegistry.getControlledStyles(namespace)
    const controlledClasses = Array.from(controlledStylesByClass.keys())

    const styleData = controlledStylesByClass.get(resolvedClassName)

    expect(registrySubscribeSpy).toHaveBeenCalledTimes(1)
    expect(styleElementsForClass).toHaveLength(1)
    expect(styleElement).toBeDefined()
    assert(styleElement)
    expect(controlledClasses).toHaveLength(1)
    expect(controlledClasses[0]).toBe(resolvedClassName)
    expect(styleData).toBeDefined()
    assert(styleData)

    if (resources.length === 0) {
      expect(registryNotifyListenersSpy).toHaveBeenCalledTimes(1)
      expect(styleElementUpdaterSpy).not.toHaveBeenCalled()
    } else {
      expect(registryNotifyListenersSpy).toHaveBeenCalledTimes(2)
      expect(styleElementUpdaterSpy).toHaveBeenCalledTimes(1)
    }

    expect(styleData.css).toBe(styleElementTextContent)
    expect(styleData.css).toMatchSnapshot('css')
  })
})
