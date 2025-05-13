/**
 * Health check endpoint for Remix
 * Used by test infrastructure to verify server readiness
 */
export async function loader() {
  return new Response(JSON.stringify({
    status: 'ok',
    framework: 'remix',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-Powered-By': 'Remix'
    }
  });
}