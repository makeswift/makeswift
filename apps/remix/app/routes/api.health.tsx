import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

/**
 * Health check endpoint for Remix
 * Used by test infrastructure to verify server readiness
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    status: 'ok',
    framework: 'remix',
    timestamp: new Date().toISOString()
  });
}