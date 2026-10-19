/** Calls `callback` when the page is idle. Safari does not have `requestIdleCallback`. */
export function whenIdle(callback: () => void, fallbackDelay = 0): () => void {
  if (typeof requestIdleCallback !== 'function') {
    const timeout = setTimeout(callback, fallbackDelay)
    return () => clearTimeout(timeout)
  }

  const handle = requestIdleCallback(callback)
  return () => cancelIdleCallback(handle)
}

export type IdleTask = {
  /** Runs the task now, if it did not start yet. */
  runNow(): void
  /** Removes the task, if it did not start yet. */
  cancel(): void
}

type Task = () => Promise<void>

const queue: Task[] = []
let isWaiting = false

function runNext(): void {
  if (isWaiting || queue.length === 0) return

  isWaiting = true
  whenIdle(() => {
    const task = queue.shift()

    void (task?.() ?? Promise.resolve())
      .catch(() => {})
      .then(() => {
        isWaiting = false
        runNext()
      })
  })
}

/**
 * Runs the task when the page is idle, after the tasks before it. One task
 * runs at a time, so many editors start without one long task that blocks
 * the page.
 */
export function queueIdleTask(task: Task): IdleTask {
  queue.push(task)
  runNext()

  const remove = (): boolean => {
    const index = queue.indexOf(task)
    if (index === -1) return false

    queue.splice(index, 1)
    return true
  }

  return {
    runNow: () => {
      if (remove()) void task().catch(() => {})
    },
    cancel: () => {
      remove()
    },
  }
}
