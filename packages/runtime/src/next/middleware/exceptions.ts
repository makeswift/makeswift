export const MiddlewareErrorCodes = {
  INVARIANT_DRAFT_REQUEST: 'INVARIANT_DRAFT_REQUEST',
  UNAUTHORIZED_DRAFT_REQUEST: 'UNAUTHORIZED_DRAFT_REQUEST',
  UNPARSEABLE_DRAFT_COOKIE_RESPONSE: 'UNPARSEABLE_DRAFT_COOKIE_RESPONSE',
  MISSING_DRAFT_ENDPOINT: 'MISSING_DRAFT_ENDPOINT',
  UNKNOWN_DRAFT_FETCH_REQUEST_ERROR: 'UNKNOWN_DRAFT_FETCH_REQUEST_ERROR',
} as const

type MiddlewareErrorCode = keyof typeof MiddlewareErrorCodes

export const MiddlewareErrorNames = {
  [MiddlewareErrorCodes.INVARIANT_DRAFT_REQUEST]: 'InvariantDraftRequestError',
  [MiddlewareErrorCodes.UNAUTHORIZED_DRAFT_REQUEST]: 'UnauthorizedDraftRequestError',
  [MiddlewareErrorCodes.UNPARSEABLE_DRAFT_COOKIE_RESPONSE]: 'UnparseableDraftCookieResponseError',
  [MiddlewareErrorCodes.MISSING_DRAFT_ENDPOINT]: 'MissingDraftEndpointError',
  [MiddlewareErrorCodes.UNKNOWN_DRAFT_FETCH_REQUEST_ERROR]: 'UnknownDraftFetchRequestError',
} as const

export class MiddlewareError extends Error {
  code: string

  constructor(code: MiddlewareErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = MiddlewareErrorNames[code] // Set the error name to your custom error class name

    Object.setPrototypeOf(this, MiddlewareError.prototype)
  }
}

export class InvariantDraftRequestError extends MiddlewareError {
  constructor(message: string) {
    super(MiddlewareErrorCodes.INVARIANT_DRAFT_REQUEST, message)
  }
}

export class UnauthorizedDraftRequestError extends MiddlewareError {
  constructor(message: string) {
    super(MiddlewareErrorCodes.UNAUTHORIZED_DRAFT_REQUEST, message)
  }
}

export class UnparseableDraftCookieResponseError extends MiddlewareError {
  constructor(message: string) {
    super(MiddlewareErrorCodes.UNPARSEABLE_DRAFT_COOKIE_RESPONSE, message)
  }
}

export class MissingDraftEndpointError extends MiddlewareError {
  constructor(message: string) {
    super(MiddlewareErrorCodes.MISSING_DRAFT_ENDPOINT, message)
  }
}

export class UnknownDraftFetchRequestError extends MiddlewareError {
  constructor(message: string) {
    super(MiddlewareErrorCodes.UNKNOWN_DRAFT_FETCH_REQUEST_ERROR, message)
  }
}
