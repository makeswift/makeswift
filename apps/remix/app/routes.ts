import { type RouteConfig, route } from '@react-router/dev/routes'

export default [route(':path', 'routes/$path.tsx')] satisfies RouteConfig
