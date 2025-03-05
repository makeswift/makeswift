export class MiddlewareError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export class InvariantDraftRequestError extends MiddlewareError {}

export class UnauthorizedDraftRequestError extends MiddlewareError {}

export class UnparseableDraftCookieResponseError extends MiddlewareError {}

export class MissingDraftEndpointError extends MiddlewareError {}

export class UnknownDraftFetchRequestError extends MiddlewareError {}

export class InvalidProxyRequestInputError extends MiddlewareError {}
