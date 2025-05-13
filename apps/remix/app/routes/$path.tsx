import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { client } from '../makeswift/client'
import { Page as MakeswiftPage, getSiteVersion } from '@makeswift/remix'

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get the path from the URL params
  const path = params.path ? `/${params.path}` : '/'

  try {
    // Get the site version based on draft mode
    const siteVersion = await getSiteVersion(request)
    
    // Get the page snapshot from Makeswift
    const snapshot = await client.getPageSnapshot(path, {
      siteVersion,
    })

    if (!snapshot) {
      throw new Response('Not Found', { status: 404 })
    }

    return json({ snapshot })
  } catch (error) {
    console.error('Error fetching Makeswift page:', error)
    throw new Response('Error fetching Makeswift page', { status: 500 })
  }
}

export default function Page() {
  const { snapshot } = useLoaderData<typeof loader>()

  if (!snapshot) {
    return <div>Page not found</div>
  }

  return <MakeswiftPage snapshot={snapshot} />
}
