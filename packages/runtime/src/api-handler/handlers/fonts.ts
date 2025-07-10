import { type ApiRequest, ApiResponse } from '../request-response'

type FontVariant = { weight: string; style: 'italic' | 'normal'; src?: string }

export type Font = {
  family: string
  label?: string
  variants: FontVariant[]
}

type Fonts = Font[]

export type GetFonts = () => Fonts | Promise<Fonts>

export async function fontsHandler(
  _req: ApiRequest,
  { getFonts }: { getFonts?: GetFonts },
): Promise<ApiResponse<Fonts>> {
  const fonts = (await getFonts?.()) ?? []

  return ApiResponse.json(fonts)
}
