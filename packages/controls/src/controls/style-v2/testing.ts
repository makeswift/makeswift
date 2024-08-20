import {
  StyleV2Definition as BaseDefinition,
  StyleV2Config,
  StyleV2PropDefinition,
} from './style-v2'

export type StylesObject = {
  textAlignment?: 'left' | 'right' | 'center'
  visibility?: 'visible' | 'hidden'
}

type PropDefinition = StyleV2PropDefinition
type Config<Prop extends PropDefinition> = StyleV2Config<Prop, StylesObject>

export class Definition<
  Prop extends PropDefinition = PropDefinition,
> extends BaseDefinition<Prop, StylesObject> {}

export function StyleV2<Prop extends PropDefinition>(
  config: Config<Prop>,
): Definition<Prop> {
  return new Definition(config)
}

export { Definition as StyleV2Definition }
