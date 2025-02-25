import { withMakeswiftMiddleware } from '@makeswift/runtime/next/middleware'
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'

export default withMakeswiftMiddleware({ apiKey: MAKESWIFT_SITE_API_KEY })

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
