import { queueIdleTask } from '../idle-queue'

/** Waits for the queue. Without `requestIdleCallback`, it uses timeouts. */
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

describe('the idle queue', () => {
  test('runs the tasks one at a time, in order', async () => {
    const log: string[] = []
    let finishFirst = () => {}

    queueIdleTask(async () => {
      log.push('first start')
      await new Promise<void>(resolve => {
        finishFirst = resolve
      })
      log.push('first end')
    })
    queueIdleTask(async () => {
      log.push('second')
    })

    await settle()
    expect(log).toEqual(['first start'])

    finishFirst()
    await settle()
    expect(log).toEqual(['first start', 'first end', 'second'])
  })

  test('runs a task at once, and not again from the queue', async () => {
    const task = jest.fn(async () => {})
    const queued = queueIdleTask(task)

    queued.runNow()
    expect(task).toHaveBeenCalledTimes(1)

    await settle()
    queued.runNow()
    expect(task).toHaveBeenCalledTimes(1)
  })

  test('does not run a canceled task', async () => {
    const task = jest.fn(async () => {})

    queueIdleTask(task).cancel()
    await settle()

    expect(task).not.toHaveBeenCalled()
  })

  test('continues after a task fails', async () => {
    const task = jest.fn(async () => {})

    queueIdleTask(() => Promise.reject(new Error('fail')))
    queueIdleTask(task)
    await settle()

    expect(task).toHaveBeenCalledTimes(1)
  })
})
