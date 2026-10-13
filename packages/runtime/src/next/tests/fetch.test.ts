import { MAKESWIFT_CACHE_TAG } from '../cache'
import { fetch } from '../fetch'

test('merges Next.js fetch options with ours', async () => {
  const globalFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())

  await fetch('https://example.com', {
    next: { revalidate: 60, tags: ['custom-tag'] },
  })

  expect(globalFetch).toHaveBeenCalledWith('https://example.com', {
    next: {
      revalidate: 60,
      tags: ['custom-tag', MAKESWIFT_CACHE_TAG],
    },
  })
})
