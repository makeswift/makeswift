import { ComponentMeta, getComponentsMeta } from '../../../state/modules/components-meta'
import { useSelector } from './use-selector'

export function useComponentMeta(type: string): ComponentMeta | null {
  return useSelector(state => getComponentsMeta(state.componentsMeta).get(type) ?? null)
}
