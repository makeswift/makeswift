import {
  type ComponentType,
  type ComponentMeta,
  getReactComponent,
  getComponentMeta,
} from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useComponent(type: string): ComponentType | null {
  return useSelector(state => getReactComponent(state, type))
}

export function useComponentMeta(type: string): ComponentMeta | null {
  return useSelector(state => getComponentMeta(state, type))
}
