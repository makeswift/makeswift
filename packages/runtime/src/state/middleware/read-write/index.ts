import { MakeswiftHostApiClient } from '../../../api/client'
import { type BuilderAPIProxy } from '../../builder-api/proxy'

import { readWriteElementTreeMiddleware } from './read-write-element-tree'
import { measureBoxModelsMiddleware } from './measure-box-models'
import { builderAPIMiddleware } from './builder-api'
import { propControllerHandlesMiddleware } from './prop-controller-handles'
import { makeswiftApiClientSyncMiddleware } from './makeswift-api-client-sync'

export function createReadWriteMiddleware({
  hostApiClient,
  builderProxy,
}: {
  hostApiClient: MakeswiftHostApiClient
  builderProxy: BuilderAPIProxy
}) {
  return [
    readWriteElementTreeMiddleware(),
    measureBoxModelsMiddleware(),
    builderAPIMiddleware(builderProxy),
    propControllerHandlesMiddleware(),
    makeswiftApiClientSyncMiddleware(hostApiClient),
  ]
}
