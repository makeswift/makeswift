import { runtime } from '@/makeswift/runtime'
import { ExperimentalMakeswiftPage } from '@makeswift/runtime/next/rsc'

type ParsedUrlQuery = Promise<{ path?: string[] }>

export default async function Page(props: {
  params: ParsedUrlQuery
}): Promise<JSX.Element> {
  const params = await props.params
  const path = '/' + (params?.path ?? []).join('/')

  return (
    <ExperimentalMakeswiftPage
      runtime={runtime}
      path={path}
      siteApiKey={process.env.MAKESWIFT_SITE_API_KEY!}
      apiOrigin={process.env.NEXT_PUBLIC_MAKESWIFT_API_ORIGIN}
    />
  )
}
