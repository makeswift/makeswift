import { z } from 'zod'

const fromNodeId = (nodeId: string) => {
  const match = Buffer.from(nodeId, 'base64')
    .toString('utf8')
    .match(/^([^:]+):([^:]+)$/)

  if (!match) throw new TypeError(`NodeID cannot represent value: ${String(nodeId)}`)

  const [, typeName, key] = match

  return { key, typeName }
}

export const nodeIDorUUIDtoUUIDSchema = z.string().transform(nodeIdOrUuid => {
  const uuidParseResult = z.string().uuid().safeParse(nodeIdOrUuid)

  if (uuidParseResult.success) return uuidParseResult.data

  return fromNodeId(nodeIdOrUuid).key
})
´