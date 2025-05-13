import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { client } from '../makeswift/client'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get the path from the URL params
  const path = params.path ? `/${params.path}` : '/'

  try {
    // Get the page snapshot from Makeswift
    // In a real implementation, we'd pass the proper site version based on draft mode
    const snapshot = await client.getPageSnapshot(path, {
      siteVersion: 'Live',
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
