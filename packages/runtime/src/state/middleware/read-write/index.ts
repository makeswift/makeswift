import { type BuilderAPIProxy } from '../../builder-api/proxy'

import { updateElementTreeMiddleware } from './update-element-tree'
import { measureBoxModelsMiddleware } from './measure-box-models'
import { builderAPIMiddleware } from './builder-api'
import { propControllerHandlesMiddleware } from './prop-controller-handles'

export function createReadWriteMiddleware({ builderProxy }: { builderProxy: BuilderAPIProxy }) {
  return [
    updateElementTreeMiddleware(),
    measureBoxModelsMiddleware(),
    builderAPIMiddleware(builderProxy),
    propControllerHandlesMiddleware(),
  ]
}
