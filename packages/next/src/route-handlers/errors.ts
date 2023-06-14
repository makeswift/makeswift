export class MakeswiftApiKeyError extends Error {
  constructor(apiKey: string) {
    super(
      'The Makeswift Next.js API handler must be passed a valid Makeswift site API key: ' +
        "`MakeswiftApiHandler('<makeswift_site_api_key>')`\n" +
        `Received "${apiKey}" instead.`,
    )

    Error.captureStackTrace(this, MakeswiftApiKeyError)
  }
}

export class MakeswiftRouteHandlerCatchAllError extends Error {
  constructor(makeswift: string) {
    super(
      'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`.\n' +
        `Received "${makeswift}" for the \`makeswift\` param instead.\n` +
        'Read more about dynamic catch-all routes here: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
    )

    Error.captureStackTrace(this, MakeswiftApiKeyError)
  }
}
