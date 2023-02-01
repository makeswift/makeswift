import { BoxModel, getBox } from '../../state/modules/box-models'
import deepEqual from '../../utils/deepEqual'

export function pollBoxModel({
  element,
  onBoxModelChange,
}: {
  element: Element
  onBoxModelChange(boxModel: BoxModel | null): void
}): () => void {
  let currentBoxModel: BoxModel | null = null

  const handleAnimationFrameRequest = () => {
    const measuredBoxModel = getBox(element)

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
