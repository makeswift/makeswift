// bidirectional action types, both the host and the builder can dispatch these actions
export const SharedActionTypes = {
  MAKESWIFT_CONNECTION_INIT: 'MAKESWIFT_CONNECTION_INIT',

  REGISTER_DOCUMENT: 'REGISTER_DOCUMENT',
  UNREGISTER_DOCUMENT: 'UNREGISTER_DOCUMENT',
} as const
