import { mountComponent, unmountComponent } from '../../../../builder-api/actions'
import { MountChangeActionBuffer } from '../mount-change-action-buffer'

const mockExecute = jest.fn()

describe('MountChangeActionBuffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('executes scheduled actions after the current task completes', async () => {
    const buffer = new MountChangeActionBuffer(mockExecute)

    const action = mountComponent('a', '1')
    buffer.schedule(action)

    expect(mockExecute).not.toHaveBeenCalled()

    await Promise.resolve()

    expect(mockExecute).toHaveBeenCalledWith(action)
  })

  it('removes rundundant actions before execution', async () => {
    const buffer = new MountChangeActionBuffer(mockExecute)

    const actions = [
      mountComponent('a', '1'),
      unmountComponent('a', '1'),
      mountComponent('a', '1'),
      mountComponent('a', '2'),
    ]

    actions.forEach(action => buffer.schedule(action))

    await Promise.resolve()

    expect(mockExecute).toHaveBeenCalledTimes(2)
    expect(mockExecute).toHaveBeenCalledWith(mountComponent('a', '1'))
    expect(mockExecute).toHaveBeenCalledWith(mountComponent('a', '2'))
  })

  it('does not execute any actions when provided a matching pair of mount/unmount', async () => {
    const buffer = new MountChangeActionBuffer(mockExecute)

    const actions = [mountComponent('a', '1'), unmountComponent('a', '1')]

    actions.forEach(action => buffer.schedule(action))

    await Promise.resolve()

    expect(mockExecute).not.toHaveBeenCalled()
  })
})
