import {
  unstable_HtmlTextDefinition as BaseHtmlTextDefinition,
  type ControlInstanceArgs,
  type DeserializedRecord,
} from '@makeswift/controls'

import { HtmlTextControl } from './control'

type Config = { label?: string; description?: string; defaultValue?: string }

/**
 * A text control whose value is an HTML string. In the builder,
 * `unstable_htmlText.Text` edits the HTML in an element of the host page.
 */
export class HtmlTextDefinition extends BaseHtmlTextDefinition<HtmlTextControl> {
  static deserialize(data: DeserializedRecord): HtmlTextDefinition {
    if (data.type !== BaseHtmlTextDefinition.type) {
      throw new Error(`HtmlText: expected type ${BaseHtmlTextDefinition.type}, got ${data.type}`)
    }

    const { config } = BaseHtmlTextDefinition.schema().definition.parse(data)
    return new HtmlTextDefinition(config)
  }

  constructor({ defaultValue = '', ...config }: Config = {}) {
    super({ ...config, defaultValue })
  }

  createInstance(args: ControlInstanceArgs): HtmlTextControl {
    return new HtmlTextControl(this, args)
  }
}

export function HtmlText(config?: Config): HtmlTextDefinition {
  return new HtmlTextDefinition(config)
}
