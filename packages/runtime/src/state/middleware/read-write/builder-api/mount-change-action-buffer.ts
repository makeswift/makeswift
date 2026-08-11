import { BuilderActionTypes } from '../../../builder-api/action-types'
import type { MountComponentAction, UnmountComponentAction } from '../../../builder-api/actions'

type MountChangeAction = UnmountComponentAction | MountComponentAction

/**
 * Allows for queuing MountChangeActions dispatched via React effects into a buffer
 * processed after the completion of the current React commit (scheduled using queueMicrotask).
 *
 * Before executing the actions in the buffer, the buffer is processed removing any
 * pairs of MOUNT_COMPONENT and UNMOUNT_COMPONENT actions corresponding to the same
 * element.
 *
 * Without this buffer, moved elements will result in separate UNMOUNT and MOUNT
 * actions being sent to the builder at the time of the elements unmount at its original
 * location and remount at its new location. This causes a flicker in the builder as
 * the element is considered unmounted in the time between its UNMOUNT and MOUNT actions.
 *
 * Note that it is safe to remove these actions pairs as these actions do not communicate
 * the location of a component's mount but simply whether it is currently mounted.
 */
export class MountChangeActionBuffer {
  private scheduledActions: MountChangeAction[]
  private flushScheduled: boolean

  constructor(private readonly execute: (action: MountChangeAction) => void) {
    this.scheduledActions = []
    this.flushScheduled = false
  }

  schedule(action: MountChangeAction) {
    this.scheduledActions.push(action)

    if (!this.flushScheduled) {
      this.scheduleFlush()
    }
  }

  private scheduleFlush() {
    this.flushScheduled = true

    queueMicrotask(() => {
      this.flushScheduled = false
      const batch = this.scheduledActions
      this.scheduledActions = []

      const coalescedBatch = coalesceMountChangeActions(batch)
      coalescedBatch.forEach(action => this.execute(action))
    })
  }
}

/**
 * Provides a key for the target of a MountChangeAction. elementKey on its own is
 * not enough as it is not unique across documents.
 */
function key(a: { payload: { documentKey: string; elementKey: string } }) {
  return `${a.payload.documentKey}:${a.payload.elementKey}`
}

/**
 * Removes pairs of MOUNT_COMPONENT and UNMOUNT_COMPONENT actions, if there are actions leftover it returns a single
 * action corresponding to the leftover type.
 */
function coalesceMountChangeActions(batch: MountChangeAction[]): MountChangeAction[] {
  const mountsPerElement = new Map<
    string,
    { count: number; payload: MountChangeAction['payload'] }
  >()

  batch.forEach(action => {
    const actionKey = key(action)
    const currentCount = mountsPerElement.get(actionKey)?.count ?? 0
    mountsPerElement.set(actionKey, {
      count:
        action.type === BuilderActionTypes.MOUNT_COMPONENT ? currentCount + 1 : currentCount - 1,
      payload: action.payload,
    })
  })

  return [...mountsPerElement.values()]
    .filter(({ count }) => count != 0)
    .map(({ count, payload }) => ({
      type: count > 0 ? BuilderActionTypes.MOUNT_COMPONENT : BuilderActionTypes.UNMOUNT_COMPONENT,
      payload,
    }))
}
