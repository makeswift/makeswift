import { PreviewData } from 'next'
import { z } from 'zod'
import {
  getConnectionCheckScriptLiteral,
  getDraftScriptLiteral,
} from './utils/create-template-scripts'
import { PostMessageType } from './utils/post-message'

export const makeswiftSiteVersionSchema = z.enum(['Live', 'Working'])
export const MakeswiftSiteVersion = makeswiftSiteVersionSchema.Enum
export type MakeswiftSiteVersion = z.infer<typeof makeswiftSiteVersionSchema>

const makeswiftPreviewDataSchema = z.object({
  makeswift: z.literal(true),
  siteVersion: makeswiftSiteVersionSchema,
})
export type MakeswiftPreviewData = z.infer<typeof makeswiftPreviewDataSchema>

export function getMakeswiftSiteVersion(previewData: PreviewData): MakeswiftSiteVersion | null {
  const result = makeswiftPreviewDataSchema.safeParse(previewData)

  if (result.success) return result.data.siteVersion

  return null
}

type Props = {
  isPreview?: boolean
  appOrigin?: string
}

export function PreviewModeScript({
  isPreview = false,
  appOrigin = 'https://app.makeswift.com',
}: Props) {
  const previewModeScript = getDraftScriptLiteral({
    isDraft: isPreview,
    appOrigin,
    draftHeaderName: 'X-Makeswift-Preview-Mode',
    draftSearchParamName: 'x-makeswift-preview-mode',
    draftBuilderHandshakeType: PostMessageType.PreviewModeHandshake,
  })

  const makeswiftConnectionCheckScript = getConnectionCheckScriptLiteral(appOrigin)

  return (
    <>
      <script
        id="makeswift-preview-mode"
        type="module"
        dangerouslySetInnerHTML={{ __html: previewModeScript }}
      />
      <script
        id="makeswift-connection-check"
        type="module"
        dangerouslySetInnerHTML={{ __html: makeswiftConnectionCheckScript }}
      />
    </>
  )
}
