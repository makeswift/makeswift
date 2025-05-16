export async function loader({ request }: { request: Request }) {
  // Common CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // ⚠ opens to any origin
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle the browser’s CORS pre-flight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  // Normal GET response
  return new Response(
    JSON.stringify({
      version: '0.24.5',
      previewMode: false,
      draftMode: true,
      interactionMode: true,
      clientSideNavigation: false,
      elementFromPoint: false,
      customBreakpoints: true,
      siteVersions: true,
      unstable_siteVersions: true,
      localizedPageSSR: true,
      webhook: true,
      localizedPagesOnlineByDefault: true,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    },
  )
}
