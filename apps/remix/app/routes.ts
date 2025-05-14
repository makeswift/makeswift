import { type RouteConfig, index, route } from '@react-router/dev/routes'

// Use the $path route for both the root path and any other paths
export default [index('routes/$path.tsx')] satisfies RouteConfig
