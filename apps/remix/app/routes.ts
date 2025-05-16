import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('api/makeswift/manifest', 'routes/manifest.ts'),
] satisfies RouteConfig
