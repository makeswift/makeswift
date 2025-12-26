import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { env } from 'env'

const appId = env.NEXT_PUBLIC_ALGOLIA_APP_ID
const searchApiKey = env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY

const client = algoliasearch(appId, searchApiKey)

export default client
