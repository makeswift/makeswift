import { type ReactNode, lazy } from 'react'

import { type DataType, type ConfigType } from '@makeswift/controls'

import { RichTextV2Control, RichTextV2Definition } from '../../../../controls/rich-text-v2'

import { RichTextV2 } from './rich-text-v2'

const ReadOnlyTextV1 = lazy(() => import('../rich-text/ReadOnlyText'))

export function renderRichTextV2(
  data: DataType<RichTextV2Definition> | undefined,
  config: ConfigType<RichTextV2Definition>,
  control: RichTextV2Control | null,
): ReactNode {
  return RichTextV2Definition.isV1Data(data) ? (
    <ReadOnlyTextV1 text={data} />
  ) : (
    <RichTextV2 data={data} config={config} control={control} />
  )
}
