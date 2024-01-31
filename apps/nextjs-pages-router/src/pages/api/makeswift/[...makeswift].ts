import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'
import { runtime } from '@/makeswift/runtime'
import { MakeswiftApiHandler } from '@makeswift/runtime/next/server'

export default MakeswiftApiHandler(MAKESWIFT_SITE_API_KEY, { runtime })
