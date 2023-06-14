import { NextRequest, NextResponse } from 'next/server'
import { MakeswiftRouteHandlerConfig } from '../types'

export type Manifest = {
  previewMode: boolean
  interactionMode: boolean
  clientSideNavigation: boolean
  elementFromPoint: boolean
  customBreakpoints: boolean
  unstable_siteVersions: boolean
}

export async function manifestHandler(
  request: NextRequest,
  headers: Headers,
  { apiKey, unstable_siteVersions }: Required<MakeswiftRouteHandlerConfig>,
): Promise<NextResponse> {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')

  if (secret !== apiKey) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401, headers },
    )
  }

  return NextResponse.json({
    previewMode: true,
    interactionMode: true,
    clientSideNavigation: true,
    elementFromPoint: false,
    customBreakpoints: true,
    unstable_siteVersions,
  })
}
