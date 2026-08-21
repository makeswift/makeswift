import 'server-only'

import { updateServerCounter, getServerCounter } from './action'

export async function ServerCounter() {
  return (
    <form action={updateServerCounter.bind(null, 1)}>
      <button>Server Counter: {await getServerCounter()}</button>
    </form>
  )
}
