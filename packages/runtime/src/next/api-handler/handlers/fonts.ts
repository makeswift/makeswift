import { NextApiRequest, NextApiResponse } from 'next'

type FontVariant = { weight: string; style: 'italic' | 'normal'; src?: string }

export type Font = {
  family: string
  label?: string
  variants: FontVariant[]
}

type Fonts = Font[]

export type GetFonts = () => Fonts | Promise<Fonts>

export type FontsResponse = Fonts

export default async function fonts(
  _req: NextApiRequest,
  res: NextApiResponse<FontsResponse>,
  { getFonts }: { getFonts?: GetFonts } = {},
): Promise<void> {
  const fonts = (await getFonts?.()) ?? []

  return res.json(fonts)
}
