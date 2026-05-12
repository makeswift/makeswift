import { BoxDisplayModel, getBox } from '../../state/modules/read-write/box-models'
import deepEqual from '../../utils/deepEqual'

export function pollBoxModel({
  element,
  onBoxModelChange,
}: {
  element: Element | null
  onBoxModelChange(boxModel: BoxDisplayModel | null): void
}): () => void {
  let currentBoxModel: BoxDisplayModel | null = null

  const handleAnimationFrameRequest = () => {
    const measuredBoxModel = element == null ? null : getBox(element)

    if (!deepEqual(currentBoxModel, measuredBoxModel)) {
      currentBoxModel = measuredBoxModel

      onBoxModelChange(currentBoxModel)
    }

    animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)
  }

  let animationFrameHandle = requestAnimationFrame(handleAnimationFrameRequest)

  return () => {
    cancelAnimationFrame(animationFrameHandle)

    onBoxModelChange(null)
  }
}
