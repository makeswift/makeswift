import { ComponentType, getReactComponent } from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useComponent(type: string): ComponentType | null {
  return useSelector(state => getReactComponent(state, type))
}
