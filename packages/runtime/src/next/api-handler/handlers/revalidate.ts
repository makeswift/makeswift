import { NextApiRequest, NextApiResponse } from 'next'
import isErrorWithMessage from '../../../utils/isErrorWithMessage'

type RevalidationResult = { revalidated: boolean }

type RevalidationError = { message: string }

export type RevalidationResponse = RevalidationResult | RevalidationError

export async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse<RevalidationResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  if (req.query.secret !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (typeof req.query.path !== 'string') {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const revalidate = res.revalidate

  if (typeof revalidate !== 'function') {
    const message =
      `Cannot revalidate path "${req.query.path}" because \`revalidate\` function does not exist in API handler response. ` +
      'Please update to Next.js v12.2.0 or higher for support for on-demand revalidation.\n' +
      'Read more here: https://nextjs.org/blog/next-12-2#on-demand-incremental-static-regeneration-stable'

    console.warn(message)

    return res.json({ revalidated: false })
  }

  try {
    await revalidate(req.query.path)

    return res.json({ revalidated: true })
  } catch (error) {
    if (isErrorWithMessage(error)) {
      return res.status(500).json({ message: error.message })
    }

    return res.status(500).json({ message: 'Error Revalidating' })
  }
}
