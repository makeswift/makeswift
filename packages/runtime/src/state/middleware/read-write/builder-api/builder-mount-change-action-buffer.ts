import { BuilderActionTypes } from '../../../builder-api/action-types'
import type { MountComponentAction, UnmountComponentAction } from '../../../builder-api/actions'
import type { BuilderAPIProxy } from '../../../builder-api/proxy'

type MountChangeAction = UnmountComponentAction | MountComponentAction

/**
 * Allows for queuing MountChangeActions dispatched via React effects into a buffer
 * processed after the completion of the current React commit.
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
export class BuilderMountChangeActionBuffer {
  private readonly builderProxy: BuilderAPIProxy
  private queuedActions: MountChangeAction[]

  constructor(builderProxy: BuilderAPIProxy) {
    this.builderProxy = builderProxy
    this.queuedActions = []
  }

  enqueue(action: MountChangeAction) {
    this.queuedActions.push(action)
  }

  flush() {
    // Process the current queuedActions removing redundant UNMOUNT/MOUNT pairs.
    const batch = this.queuedActions
    this.queuedActions = []

    const coalescedBatch = removeMountUnmountPairs(batch)

    coalescedBatch.forEach(action => this.builderProxy.execute(action))
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
 * Removes pairs of MOUNT_COMPONENT and UNMOUNT_COMPONENT actions from a batch of MountChangeActions.
 */
function removeMountUnmountPairs(batch: MountChangeAction[]): MountChangeAction[] {
  // A positive number of mountsPerElement[key] indicates a net amount of MOUNT_COMPONENTs
  // A negative number of mountsPerElement[key] indicates a net amount of UNMOUNT_COMPONENTs
  const mountsPerElement = batch.reduce((mounts, action) => {
    if (action.type == BuilderActionTypes.MOUNT_COMPONENT) {
      const current = mounts.get(key(action)) ?? 0
      mounts.set(key(action), current + 1)
    }

    if (action.type == BuilderActionTypes.UNMOUNT_COMPONENT) {
      const current = mounts.get(key(action)) ?? 0
      mounts.set(key(action), current - 1)
    }

    return mounts
  }, new Map<string, number>())

  const coalescedBatch = []
  for (const action of batch) {
    const mountsRemaining = mountsPerElement.get(key(action)) ?? 0

    if (action.type == BuilderActionTypes.MOUNT_COMPONENT && mountsRemaining > 0) {
      coalescedBatch.push(action)
      mountsPerElement.set(key(action), mountsRemaining - 1)
      continue
    }

    if (action.type == BuilderActionTypes.UNMOUNT_COMPONENT && mountsRemaining < 0) {
      coalescedBatch.push(action)
      mountsPerElement.set(key(action), mountsRemaining + 1)
      continue
    }
  }

  return coalescedBatch
}
