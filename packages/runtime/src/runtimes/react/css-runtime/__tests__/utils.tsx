/**
 * This is useful for tests involving style registry subscriptions, since listeners are notified within
 * a microtask.
 */
export async function drainMicrotaskQueue() {
  return await jest.advanceTimersByTimeAsync(0)
}
