import {
  StyleV2Definition,
  StyleV2PropDefinition,
  StyleV2Control,
  type StyleV2Config,
} from '@makeswift/controls'

import { CSSObject } from '@emotion/serialize'

type PropDefinition = StyleV2PropDefinition
type Config<Prop extends PropDefinition> = StyleV2Config<Prop, CSSObject>

class Definition<Prop extends PropDefinition> extends StyleV2Definition<Prop, CSSObject> {}

export const unstable_StyleV2 = <Prop extends PropDefinition>(config: Config<Prop>) =>
  new (class unstable_StyleV2 extends Definition<Prop> {})(config)

export { Definition as StyleV2Definition, StyleV2Control, type StyleV2PropDefinition }
