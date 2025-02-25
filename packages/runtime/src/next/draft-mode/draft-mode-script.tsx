import { draftMode } from 'next/headers'
import Script from 'next/script'
import {
  getConnectionCheckScriptLiteral,
  getDraftScriptLiteral,
} from '../utils/create-template-scripts'
import { PostMessageType } from '../utils/post-message'

type Props = {
  appOrigin?: string
}

export async function DraftModeScript({ appOrigin = 'https://app.makeswift.com' }: Props) {
  const { isEnabled: isDraftModeEnabled } = await draftMode()

  const draftModeScript = getDraftScriptLiteral({
    isDraft: isDraftModeEnabled,
    appOrigin,
    draftHeaderName: 'X-Makeswift-Draft-Mode',
    draftSearchParamName: 'x-makeswift-draft-mode',
    draftBuilderHandshakeType: PostMessageType.DraftModeHandshake,
  })

  const makeswiftConnectionCheckScript = getConnectionCheckScriptLiteral(appOrigin)

  return (
    <>
      <Script
        id="makeswift-draft-mode"
        type="module"
        dangerouslySetInnerHTML={{ __html: draftModeScript }}
      />
      <Script
        id="makeswift-connection-check"
        type="module"
        dangerouslySetInnerHTML={{ __html: makeswiftConnectionCheckScript }}
      />
    </>
  )
}
