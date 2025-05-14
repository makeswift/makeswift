import { useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { client } from '../makeswift/client'
import { RemixPage } from '../makeswift/components/page'

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get the path from the URL params
  // If params.path is undefined, we're at the root path
  const path = params.path ? `/${params.path}` : '/'

  console.log(`Loading Makeswift page for path: ${path}`)

  try {
    // Always use 'Live' mode for now
    const siteVersion = 'Live'

    // Get the page snapshot from Makeswift
    const snapshot = await client.getPageSnapshot(path, {
      siteVersion,
    })

    if (!snapshot) {
      console.error(`No Makeswift page found for path: ${path}`)
      throw new Response('Not Found', { status: 404 })
    }

    return { snapshot, path }
  } catch (error) {
    console.error(`Error fetching Makeswift page for path: ${path}`, error)
    throw new Response('Error fetching Makeswift page', { status: 500 })
  }
}

export default function Page() {
  const { snapshot, path } = useLoaderData<typeof loader>()

  if (!snapshot) {
    return <div>Page not found</div>
  }

  return (
    <>
      {/* Render the Makeswift page using the snapshot with our React 19 compatible component */}
      <RemixPage snapshot={snapshot} />
    </>
  )
}
