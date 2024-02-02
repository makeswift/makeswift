import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

type FontVariant = { weight: string; style: 'italic' | 'normal'; src?: string }

export type Font = {
  family: string
  label?: string
  variants: FontVariant[]
}

type Fonts = Font[]

export type GetFonts = () => Fonts | Promise<Fonts>

export type FontsResponse = Fonts

type FontsHandlerArgs =
  | [request: NextRequest, context: Context, params: { getFonts?: GetFonts }]
  | [req: NextApiRequest, res: NextApiResponse<FontsResponse>, params: { getFonts?: GetFonts }]

export default async function fonts(
  request: NextRequest,
  context: Context,
  { getFonts }: { getFonts?: GetFonts },
): Promise<NextResponse<FontsResponse>>
export default async function fonts(
  _req: NextApiRequest,
  res: NextApiResponse<FontsResponse>,
  { getFonts }: { getFonts?: GetFonts },
): Promise<void>
export default async function fonts(
  ...args: FontsHandlerArgs
): Promise<NextResponse<FontsResponse> | void> {
  const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
  const apiRoutePattern = [P.any, P.any, P.any] as const
  const [, , { getFonts }] = args

  const fonts = (await getFonts?.()) ?? []

  return match(args)
    .with(routeHandlerPattern, () => NextResponse.json(fonts))
    .with(apiRoutePattern, ([, res]) => res.json(fonts))
    .exhaustive()
}
