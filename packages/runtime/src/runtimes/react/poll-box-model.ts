import { BoxDisplayModel, getBox } from '../../state/modules/read-write/box-models'
import deepEqual from '../../utils/deepEqual'

export function pollBoxModel({
  getElement,
  onBoxModelChange,
}: {
  getElement: () => Element | null
  onBoxModelChange(boxModel: BoxDisplayModel | null): void
}): () => void {
  let currentBoxModel: BoxDisplayModel | null = null

  const handleAnimationFrameRequest = () => {
    const element = getElement()
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
