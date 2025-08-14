import { ActionTypes, isKnownAction } from '../actions'

describe('isKnownAction', () => {
  test.each([
    null,
    undefined,
    'test action',
    42,
    true,
    false,
    [],
    {},
    { type: 'test action' },
    { type: 17 },
    { type: { foo: 'bar' } },
  ])("doesn't error, returns false for unknown action %s", action => {
    // Assert
    expect(isKnownAction(action)).toEqual(false)
  })

  test.each(Object.values(ActionTypes).map(type => ({ type })))(
    'returns true for a known action %s',
    action => {
      // Assert
      expect(isKnownAction(action)).toEqual(true)
    },
  )
})
