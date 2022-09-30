import { MakeswiftApiHandler } from '@makeswift/runtime/next'
import { getConfig } from 'lib/config'

const config = getConfig()
export default MakeswiftApiHandler(config.makeswiftSiteApiKey)
