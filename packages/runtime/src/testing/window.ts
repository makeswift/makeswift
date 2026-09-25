/*
 * Mock `window.postMessage` together with `MessageChannel`
 */
function mockPostMessage(): { mock: jest.SpyInstance; restore: () => void } {
  const postMessageMock = jest.spyOn(window, 'postMessage').mockImplementation(() => {})

  const originalMessageChannel = window.MessageChannel
  const stubPort = () => ({ onmessage: null, postMessage: () => {}, close: () => {} })
  window.MessageChannel = class {
    port1 = stubPort()
    port2 = stubPort()
  } as unknown as typeof MessageChannel

  return {
    mock: postMessageMock,
    restore: () => {
      postMessageMock.mockRestore()
      window.MessageChannel = originalMessageChannel
    },
  }
}

export const windowMocks = {
  mockPostMessage,
}
