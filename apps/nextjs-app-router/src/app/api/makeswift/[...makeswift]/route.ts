import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

const handler = MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY)

export const GET = handler
export const POST = handler
