import { BuilderEditMode } from '../../../state/modules/builder-edit-mode'
import { getBuilderEditMode } from '../../../state/react-page'
import { useSelector } from './use-selector'

export function useBuilderEditMode(): BuilderEditMode | null {
  return useSelector(state => getBuilderEditMode(state))
}
