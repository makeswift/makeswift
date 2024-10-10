import * as LocalizedResourcesMap from '../localized-resources-map'
import * as Actions from '../../actions'

describe('state / LocalizedResourcesMap', () => {
  test('`getInitialState` w/o arguments returns an empty state', () => {
    const state = LocalizedResourcesMap.getInitialState()
    const serializedState = LocalizedResourcesMap.getSerializedState(state)
    expect(serializedState).toStrictEqual({})
  })

  test('`getInitialState`/`getSerializedState` are symmetrical', () => {
    const serializedState = {
      'fr-FR': {
        '11': '21',
        '12': '22',
      },
      'it-IT': {
        '13': '23',
      },
    }

    const state = LocalizedResourcesMap.getInitialState(serializedState)
    expect(LocalizedResourcesMap.getSerializedState(state)).toStrictEqual(serializedState)
  })

  test('`Actions.setLocalizedResourceId` correctly updates the store', () => {
    const state = LocalizedResourcesMap.getInitialState({
      'fr-FR': {
        '11': '21',
        '12': '22',
      },
      'it-IT': {
        '13': '23',
      },
    })

    const updatedState = [
      ['11', '2111', 'fr-FR'],
      ['13', '2333', 'fr-FR'],
      ['14', '2444', 'it-IT'],
      ['15', '2555', 'es-ES'],
    ].reduce(
      (state, [resourceId, localizedResourceId, locale]) =>
        LocalizedResourcesMap.reducer(
          state,
          Actions.setLocalizedResourceId({ resourceId, localizedResourceId, locale }),
        ),
      state,
    )

    expect(LocalizedResourcesMap.getSerializedState(updatedState)).toMatchSnapshot()
  })

  test('`Actions.updateAPIClientCache` fills in the state from cache w/o overriding existing resources', () => {
    const state = LocalizedResourcesMap.getInitialState()

    const updatedState = (
      [
        {
          'fr-FR': {
            '11': '21',
            '12': '22',
          },
          'it-IT': {
            '13': '23',
          },
        },
        {
          'fr-FR': {
            '11': '2111',
            '13': '2333',
          },
          'it-IT': {
            '14': '2444',
          },
        },
      ] as LocalizedResourcesMap.SerializedState[]
    ).reduce(
      (state, localizedResourcesMap) =>
        LocalizedResourcesMap.reducer(
          state,
          Actions.updateAPIClientCache({ apiResources: {}, localizedResourcesMap }),
        ),
      state,
    )

    expect(LocalizedResourcesMap.getSerializedState(updatedState)).toMatchSnapshot()
  })
})
